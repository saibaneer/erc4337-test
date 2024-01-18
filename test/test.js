const hre = require('hardhat')

const EntryPointAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const smartAccount = '0x75537828f2ce51be7289709686A69CbFDbB714F1'

async function main() {
    const Account = await hre.ethers.getContractAt('Account', smartAccount);
    console.log("Count is at: ", await Account.count())


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
