const expect = require('chai').expect
const Eats = artifacts.require('Eats')
const utils = require('./utils')
const BigNumber = web3.BigNumber

const TOTAL_SUPPLY = 100000000000000000

let eats = null
let accounts = null
let transfer_event = null
let owner = null
let owner_balance = null
let acct_one = null
let starting_balance_one = null
let ending_balance_one = null
let acct_two = null
let starting_balance_two = null
let ending_balance_two = null
let acct_three = null
let balance1 = null
let balance2 = null
let balance3 = null
let balance4 = null

contract('EATS ERC20 Token', async (accounts) => {

  beforeEach(async () => {
    eats = await Eats.deployed()
  })

  it('should fail because the function doest not exist in Contract', async () => {
    try {
      await eats.nonExistentFunction()
    } catch (err) {
      expect(err.name).to.equal('TypeError')
      return true
    }
    throw new Error('I should never see this!')
  })

  it('should initialize with the name EATS Token', async () => {
    const name = await eats.name.call()
    expect(name.valueOf()).to.equal('EATS Token')
  })

  it('should have the token symbol EATS', async () => {
    const symbol = await eats.symbol.call()
    expect(symbol.valueOf()).to.equal('EATS')
  })

  it('should have 8 decimal places', async () => {
    const getDecimals = await eats.decimals.call()
    decimals = getDecimals.toNumber()
    expect(decimals.valueOf()).to.equal(8)
  })

  it('should have an initial owner balance of 1 Billion EATS Tokens', async () => {
    owner = accounts[0]
    owner_balance = (await eats.balanceOf(owner)).toNumber()

    expect(owner_balance).to.equal(TOTAL_SUPPLY)
  })

  it('second account should not own any tokens at initialization', async () => {
    acct_two = accounts[1]
    starting_balance_two = (await eats.balanceOf(acct_two)).toNumber()

    expect(starting_balance_two).to.equal(0)
  })

  it('should correctly transfer EATS tokens', async () => {
    acct_one = accounts[0]
    acct_two = accounts[1]
    amount = 100

    starting_balance_one = await eats.balanceOf(acct_one)
    starting_balance_two = await eats.balanceOf(acct_two)

    balance1 = starting_balance_one.toNumber()
    balance2 = starting_balance_two.toNumber()

    transfer_event = await eats.transfer(acct_two, amount, {from: acct_one})

    ending_balance_one = await eats.balanceOf(acct_one)
    ending_balance_two = await eats.balanceOf(acct_two)

    balance3 = ending_balance_one.toNumber()
    balance4 = ending_balance_two.toNumber()

    expect(balance3).to.equal(balance1 - 100)
    expect(balance4).to.equal(balance2 + 100)

  })

  it('should not be possible to transfer more tokens than you have', async () => {
    acct_two = accounts[1]
    acct_three = accounts[2]
    amount = 1000

    await utils.assertRevert(eats.transfer(acct_three, amount, {from: acct_two}))
  })

  it('should not allow a non-owner transfer of ownership', async () => {
    acct_two = accounts[1]
    await utils.assertRevert(eats.setOwner(acct_two, {from: acct_two}))
  })

})
