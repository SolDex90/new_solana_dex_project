use anchor_lang::prelude::*;
use anchor_spl::token::{self as token_module, Token, TokenAccount as SplTokenAccount};
use solana_program::entrypoint::ProgramResult;
use rand::seq::SliceRandom;

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

    pub fn initialize_token(ctx: Context<InitializeToken>) -> ProgramResult {
        let token_account = &mut ctx.accounts.token_account;
        token_account.amount = 0;
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

    pub fn match_orders(ctx: Context<MatchOrders>) -> ProgramResult {
        let market = &mut ctx.accounts.market;

        let mut rng = rand::thread_rng();
        market.orders.shuffle(&mut rng);

        for i in 0..market.orders.len() {
            for j in (i + 1)..market.orders.len() {
                let order_a = &market.orders[i];
                let order_b = &market.orders[j];

                if order_a.order_type != order_b.order_type && order_a.price == order_b.price {
                    // Match orders
                    market.orders.remove(j);
                    market.orders.remove(i);
                    break;
                }
            }
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
pub struct InitializeToken<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(init, payer = authority, space = 8 + 8)]
    pub token_account: Account<'info, CustomTokenAccount>,
    pub system_program: Program<'info, System>,
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

#[account]
pub struct CustomTokenAccount {
    pub amount: u64,
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
