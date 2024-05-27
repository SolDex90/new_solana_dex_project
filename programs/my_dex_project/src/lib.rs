use anchor_lang::prelude::*;
mod random; // Ensure this line is present to declare the module

declare_id!("BWSMgwKYXkdnqPJA3ZKqkXFvxeYhmbotpwEHnWBgjQH2");

#[program]
pub mod my_dex_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Initialize function called");
        let data_account = &mut ctx.accounts.data;
        data_account.value = 0;
        msg!("Data account initialized with value: {}", data_account.value);
        
        // Generate random key and print it
        let key = random::generate_random_key();
        msg!("Generated random key: {:?}", key);
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub data: Account<'info, Data>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Data {
    pub value: u64,
}
