const expect = require('chai').expect
const Eats = artifacts.require('Eats')
const utils = require('./utils')
const BigNumber = web3.BigNumber

const TOTAL_SUPPLY = 100000000000000000

let eats = null
let accounts = null
let owner = null
let owner_balance = null
let acct_one = null
let starting_balance_one = null
let ending_balance_one = null
let acct_two = null
let starting_balance_two = null
let ending_balance_two = null

contract('EATS ERC20 Token Methods Tests', async (accounts) => {

  beforeEach(async () => {
    eats = await Eats.deployed()
  })

  it('should fail because function doest not exist in Contract', async () => {
    try {
      await eats.nonExistentFunction()
    } catch (err) {
      expect(err.name).to.equal('TypeError')
      return true
    }
    throw new Error('I should never see this!')
  })

  it('should initialize the token with the name EATS Token', async () => {
    const name = await eats.name.call()
    expect(name.valueOf()).to.equal('EATS Token')
  })

  it('should have the token symbol EATS', async () => {
    const symbol = await eats.symbol.call()
    expect(symbol.valueOf()).to.equal('EATS')
  })

  it('should have 8 decimal places', async () => {
    const decimals = await eats.decimals()
    expect(decimals.valueOf()).to.equal(8)
  })

  it('should have an initial balance of 1 Billion Tokens', async () => {
    owner = accounts[0]
    ownerBalance = (await eats.balanceOf(owner)).toNumber()
    expect(ownerBalance).to.equal(TOTAL_SUPPLY)
  })

})
