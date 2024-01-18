// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    // const entryPoint = await hre.ethers.deployContract("EntryPoint");
    const [signer] = await hre.ethers.getSigners()
    const signerAddress = await signer.getAddress()

    const ACCOUNT_FACTORY = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
    const ENTRY_POINT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const FACTORY_NONCE = 1;
    const sender = hre.ethers.getCreateAddress({ from: ACCOUNT_FACTORY, nonce: FACTORY_NONCE });

    const entryPoint = await hre.ethers.getContractAt('EntryPoint', ENTRY_POINT);
    const accountFactory = await hre.ethers.getContractFactory('AccountFactory');
    const account = await hre.ethers.getContractFactory('Account')
    //CREATE (OPCODE) => hash(deployer + nonce)

    const initCode = ACCOUNT_FACTORY + accountFactory.interface.encodeFunctionData('createAccount', [signerAddress]).slice(2)
    await entryPoint.depositTo(sender, { value: hre.ethers.parseEther('1') })
    // console.log('Count before executing userOp is: ', await account.count())
    const userOp = {
        sender,
        nonce: await entryPoint.getNonce(sender, 0),
        initCode,
        callData:  account.interface.encodeFunctionData('execute'),
        callGasLimit: 200_000,
        verificationGasLimit: 200_000,
        preVerificationGas: 50_000,
        maxFeePerGas: hre.ethers.parseUnits('10', 'gwei'),
        maxPriorityFeePerGas: hre.ethers.parseUnits('5', 'gwei'),
        paymasterAndData: "0x",
        signature: "0x",
    }

    const tx = await entryPoint.handleOps([userOp], signerAddress);
    const receipt = await tx.wait()
    console.log(receipt.hash)
    // console.log('New count is: ', await account.count())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
