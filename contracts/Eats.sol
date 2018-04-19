pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Eats is Ownable, StandardToken {
  using SafeMath for uint256;

  string public constant name = "EATS Token";
  string public constant symbol = "EATS";
  uint8 public constant decimals = 8;

  mapping(address => uint256) balances;

  mapping(address => mapping (address => uint256)) allowed;

  uint internal totalSupply_;
  uint public INITIAL_SUPPLY;

  address public owner;

  event Transfer(address indexed from, address indexed to, uint tokens);
  event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
  event OwnershipTransferred(address indexed from, address indexed to);

  function Eats() public {
    INITIAL_SUPPLY = 100000000000000000;
    balances[msg.sender] = INITIAL_SUPPLY;
    totalSupply_ = INITIAL_SUPPLY;

    owner = msg.sender;
    emit Transfer(address(0), owner, totalSupply_);
  }

  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }

  function balanceOf(address tokenOwner) public view returns (uint256 balance) {
    return balances[tokenOwner];
  }

  function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
    return allowed[tokenOwner][spender];
  }

  function approve(address spender, uint tokens) public returns (bool success) {
    allowed[msg.sender][spender] = tokens;
    emit Approval(msg.sender, spender, tokens);
    success = true;
  }

  function transfer(address to, uint tokens) public returns (bool success) {
    require(to != address(0));
    require(tokens <= balances[msg.sender]);

    balances[msg.sender] = balances[msg.sender].sub(tokens);
    balances[to] = balances[to].add(tokens);
    emit Transfer(msg.sender, to, tokens);
    success = true;
  }

  function transferFrom(address from, address to, uint tokens) public returns (bool success) {
    require(to != address(0));
    require(tokens <= balances[msg.sender]);
    require(tokens <= allowed[from][msg.sender]);

    balances[from] = balances[from].sub(tokens);
    allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
    balances[to] = balances[to].add(tokens);
    emit Transfer(from, to, tokens);
    success = true;
  }

  function setOwner(address newOwner) public onlyOwner {
    owner = newOwner;
    emit OwnershipTransferred(owner, newOwner);
  }

  function () public payable {
    revert();
  }

}
