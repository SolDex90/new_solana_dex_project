use rand::rngs::OsRng;
use rand::RngCore;

pub fn generate_random_key() -> [u8; 32] {
    let mut rng = OsRng;
    let mut key = [0u8; 32];
    rng.fill_bytes(&mut key);
    key
}
