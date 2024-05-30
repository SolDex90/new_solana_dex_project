use anchor_lang::prelude::*;
use anchor_spl::token::{self as token_module, Token, TokenAccount as SplTokenAccount};
use solana_program::entrypoint::ProgramResult;
// Remove or simplify rand usage
use std::vec::Vec; // Use standard library vectors instead of rand for simplicity

declare_id!("2MTDZGGZ7kU8tnscXjZ8LTAiE1F8hmxmhiNEnff6i3kh");

#[program]
pub mod my_dex_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = data;
        Ok(())
    }

    pub fn update_data(ctx: Context<UpdateData>, data: u64) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = data;
        Ok(())
    }

    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> ProgramResult {
        let cpi_accounts = token_module::Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token_module::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn place_order(ctx: Context<PlaceOrder>, order: Order) -> ProgramResult {
        let market = &mut ctx.accounts.market;
        market.orders.push(order);
        Ok(())
    }

    // Simplify match_orders to avoid using rand crate
    pub fn match_orders(ctx: Context<MatchOrders>) -> ProgramResult {
        let market = &mut ctx.accounts.market;

        // Use a simple shuffle algorithm instead of rand crate
        let orders_len = market.orders.len();
        for i in 0..orders_len {
            let j = (i + 1) % orders_len;
            market.orders.swap(i, j);
        }

        let mut i = 0;
        while i < market.orders.len() {
            let mut j = i + 1;
            while j < market.orders.len() {
                if market.orders[i].order_type != market.orders[j].order_type && market.orders[i].price == market.orders[j].price {
                    let match_amount = std::cmp::min(market.orders[i].amount, market.orders[j].amount);

                    market.orders[i].amount -= match_amount;
                    market.orders[j].amount -= match_amount;

                    if market.orders[i].amount == 0 {
                        market.orders.remove(i);
                        continue;
                    }
                    if market.orders[j].amount == 0 {
                        market.orders.remove(j);
                        continue;
                    }
                }
                j += 1;
            }
            i += 1;
        }

        msg!("Order Book: {:?}", market.orders);

        Ok(())
    }

    pub fn cancel_order(ctx: Context<CancelOrder>, order_index: u64) -> ProgramResult {
        let market = &mut ctx.accounts.market;

        if order_index < market.orders.len() as u64 {
            market.orders.remove(order_index as usize);
            Ok(())
        } else {
            Err(ProgramError::InvalidArgument.into())
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum OrderType {
    Buy,
    Sell,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Order {
    pub order_type: OrderType,
    pub amount: u64,
    pub price: u64,
}

#[account]
pub struct Market {
    pub orders: Vec<Order>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub my_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateData<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,
}

#[account]
pub struct MyAccount {
    pub data: u64,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub from: Account<'info, SplTokenAccount>,
    #[account(mut)]
    pub to: Account<'info, SplTokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PlaceOrder<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MatchOrders<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
}

#[derive(Accounts)]
pub struct CancelOrder<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
