from algopy import ARC4Contract, String, Asset, UInt64, arc4, itxn, Global

class AlgoCredSBT(ARC4Contract):
    @arc4.abimethod
    def mint_certificate(self, asset_name: String, unit_name: String) -> UInt64:
        # Step: Layer-1 Soulbound Logic using ASAs
        # 'default_frozen=True' ensures the student cannot transfer it
        mint_txn = itxn.AssetConfig(
            asset_name=asset_name,
            unit_name=unit_name,
            total=1,           
            decimals=0,
            default_frozen=True, # Immutable property for SBT
            manager=Global.current_application_address,
            freeze=Global.current_application_address,
            clawback=Global.current_application_address,
        ).submit()
        
        return mint_txn.created_asset.id