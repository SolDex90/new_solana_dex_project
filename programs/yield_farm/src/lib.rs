use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

declare_id!("AyZ4a4CjSZdxU1QzYakt4TGHLcafGJgVAZeLLHFL9fc1");

#[program]
pub mod yield_farm {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>, _bump: u8) -> Result<()> {
        // Initialization logic here
        Ok(())
    }

    pub fn stake(_ctx: Context<Stake>, _amount: u64) -> Result<()> {
        // Stake logic here
        Ok(())
    }

    pub fn unstake(_ctx: Context<Unstake>, _amount: u64) -> Result<()> {
        // Unstake logic here
        Ok(())
    }

    pub fn claim_rewards(_ctx: Context<ClaimRewards>) -> Result<()> {
        // Claim rewards logic here
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 40)]
    pub farm: Account<'info, Farm>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub farm: Account<'info, Farm>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub farm_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub farm: Account<'info, Farm>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub farm_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub farm: Account<'info, Farm>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub reward_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Farm {
    pub token_mint: Pubkey,
    pub farm_token_account: Pubkey,
    pub reward_token_mint: Pubkey,
    pub reward_token_account: Pubkey,
}
