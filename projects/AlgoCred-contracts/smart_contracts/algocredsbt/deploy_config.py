import os
import sys
from dotenv import load_dotenv

sys.path.append(os.getcwd())

from algokit_utils import AlgorandClient
from smart_contracts.artifacts.algocredsbt.algocredsbt_client import AlgoCredSbtFactory


def deploy():
    load_dotenv()

    algorand = AlgorandClient.from_environment()

    mnemonic = "never smooth olive nest success ranch hire fortune trim deer borrow mule judge pistol convince scrub wear cloud weasel put layer green want abandon off"

    # ✅ Correct way
    account = algorand.account.from_mnemonic(mnemonic=mnemonic)
    signer = account.signer

    print(f"🚀 Deploying using account: {account.address}")

    factory = AlgoCredSbtFactory(
        algorand=algorand,
        default_sender=account.address,
        default_signer=signer,
    )

    print("Submitting deployment to Testnet...")

    app_client, result = factory.deploy()

    print("\n--- ✅ DEPLOYMENT SUCCESS ---")
    print(f"App ID: {app_client.app_id}")
    print(f"App Address: {app_client.app_address}")


if __name__ == "__main__":
    deploy()