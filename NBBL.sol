pragma solidity ^0.4.24;

contract SafeMath {

    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }

    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }

    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }

    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}


contract ERC20Interface {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}


contract NBBLToken is ERC20Interface, SafeMath {
    struct NPO {
        address npoAddress; 
        uint voteCount;
    }
    
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;
    uint public bottles = 0;
    enum State {Active, Deactive} 
    State public state = State.Deactive; 
    uint totalVote = 0;
    NPO [] npos;
    address chairperson;
    address recycler; 
    
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
    
    
    modifier validState(State currentState){ 
        require(state == currentState); 
        _; 
    } 
    
    modifier validBottles(uint bottles, uint tokens){ 
        require(bottles >= tokens);
        _;
    }
    
    modifier onlyChair() {
        require(msg.sender == chairperson);
        _;
     }
     
     modifier onlyRecycler() {
         require(recycler != msg.sender);
         _;
     }
     
    
    constructor() public {
        chairperson = msg.sender;
        symbol = "NBBL";
        name = "The New Bottle Bill";
        decimals = 2;
        _totalSupply = 6600000000;
        balances[msg.sender] = _totalSupply; 
        emit Transfer(address(0), msg.sender, _totalSupply);
        state = State.Deactive;
        
        //numNPOs would be the actual number of non-profit-organizatons
        uint numNPOS = 10;
        for (uint npo = 0; npo < numNPOS; npo ++)
            //in reality, you would push the actual address of the NPOS here. 
            npos.push(NPO(0xa83Bb1eE5f77ac984f72B0a0EAf22525757FA056,0));
    }
    
    
 

    function insertBottle(uint n) public onlyRecycler returns (uint){
        bottles += n;
        return bottles;
    } 
 
    function totalSupply() public constant returns (uint) {
        return _totalSupply - balances[address(0)];
    }

    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }

    function transfer(address to, uint tokens) public returns (bool success) {
        if(bottles >= tokens){
            bottles -= tokens;
            balances[msg.sender] = safeSub(balances[msg.sender], tokens);
            balances[to] = safeAdd(balances[to], tokens);
            emit Transfer(msg.sender, to, tokens);
            return true;
        }
    }

    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
    
    
     function activateVoting() public onlyChair{
        state = State.Active;
    }
    
    function deactivateVoting() public onlyChair{
        state = State.Deactive;
    }
    
    function votingState() public view returns(bool){
        return state ==State.Active;
    }
    
    function vote(uint organizationNumber, uint tokens) public onlyRecycler validBottles(bottles, tokens) validState(State.Active) returns (bool success){
        npos[organizationNumber].voteCount += tokens;
        totalVote += tokens;
        return true;
    }
    
    function totalVotes() public view returns(uint){
        return totalVote;
    }
    
    function reqWinner() public validState(State.Deactive) view returns (uint winningProposal) {
        uint winningVoteCount = 0;
        for (uint npo = 0; npo < npos.length; npo++) 
            if (npos[npo].voteCount > winningVoteCount) {
                winningVoteCount = npos[npo].voteCount;
                winningProposal = npo;
            }
    }
    
    function sendToNOP() public validState(State.Deactive) returns (bool success) {
        uint winner = reqWinner();
        balances[msg.sender] = safeSub(balances[msg.sender], totalVote);
        balances[npos[winner].npoAddress] = safeAdd(balances[npos[winner].npoAddress], totalVote);
        emit Transfer(msg.sender, npos[winner].npoAddress, totalVote);
        totalVote = 0;
        return true;
    }
    

}