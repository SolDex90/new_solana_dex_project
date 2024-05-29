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

        let mut i = 0;
        while i < market.orders.len() {
            let mut j = i + 1;
            while j < market.orders.len() {
                if market.orders[i].order_type != market.orders[j].order_type && market.orders[i].price == market.orders[j].price {
                    let match_amount = std::cmp::min(market.orders[i].amount, market.orders[j].amount);

                    // Update order amounts
                    market.orders[i].amount -= match_amount;
                    market.orders[j].amount -= match_amount;

                    // Remove orders if fully matched
                    if market.orders[i].amount == 0 {
                        market.orders.remove(i);
                        // After removing an element at i, the current i is now pointing to the next element, so we need to avoid incrementing i
                        continue;
                    }
                    if market.orders[j].amount == 0 {
                        market.orders.remove(j);
                        // After removing an element at j, the current j is now pointing to the next element, so we need to avoid incrementing j
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

    // Add Liquidity Pool functionality
    pub fn add_liquidity(ctx: Context<AddLiquidity>, amount: u64) -> ProgramResult {
        let pool = &mut ctx.accounts.pool;
        pool.total_liquidity += amount;
        pool.liquidity_providers.push(LiquidityProvider {
            user: *ctx.accounts.user.key,
            amount,
        });
        Ok(())
    }

    // Staking functionality
    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> ProgramResult {
        let staking_account = &mut ctx.accounts.staking_account;
        staking_account.amount += amount;
        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> ProgramResult {
        let staking_account = &mut ctx.accounts.staking_account;
        let rewards = staking_account.calculate_rewards();
        staking_account.rewards_claimed += rewards;
        Ok(())
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct LiquidityProvider {
    pub user: Pubkey,
    pub amount: u64,
}

#[account]
pub struct LiquidityPool {
    pub total_liquidity: u64,
    pub liquidity_providers: Vec<LiquidityProvider>,
}

#[account]
#[derive(Default)]
pub struct StakingAccount {
    pub amount: u64,
    pub rewards_claimed: u64,
}

impl StakingAccount {
    fn calculate_rewards(&self) -> u64 {
        // Implement your reward calculation logic here
        0
    }
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

// Contexts for new functionalities

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(mut)]
    pub pool: Account<'info, LiquidityPool>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(mut)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
