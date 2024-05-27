use anchor_lang::prelude::*;
use anchor_spl::token::{self as token_module, Token, TokenAccount as SplTokenAccount};
use solana_program::entrypoint::ProgramResult;

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
        let cpi_accounts = Box::new(token_module::Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        });
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, *cpi_accounts);
        token_module::transfer(cpi_ctx, amount)?;
        Ok(())
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
    /// CHECK: This account is allowed to be unchecked as it's a signer.
    #[account(mut, signer)]
    pub authority: AccountInfo<'info>,
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
    /// CHECK: This account is allowed to be unchecked as it's a signer.
    #[account(mut, signer)]
    pub authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct CustomTokenAccount {
    pub amount: u64,
}
