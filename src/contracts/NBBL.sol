pragma solidity >=0.4.22 <=0.6.0;

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
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}


contract NBBL is ERC20Interface, SafeMath {
    struct NPO {
        address npoAddress;
        uint voteCount;
    }

    string public symbol;
    string public  name;
    uint8 decimals;
    uint public _totalSupply;
    enum State {Active, Deactive}
    State state = State.Deactive;
    uint totalVote = 0;
    NPO [] npos;
    address chairperson;
    address recycler;

    mapping(address => uint) public balances;
    mapping(address => mapping(address => uint)) allowed;
    mapping(address => uint) public ranking;
    mapping(address => uint) public bottleNums;

    modifier validState(State currentState){
        require(state == currentState);
        _;
    }

    modifier validBottles(uint tokens){
        require(bottleNums[msg.sender] >= tokens);
        _;
    }

    modifier onlyChair() {
        require(msg.sender == chairperson);
        _;
    }

    modifier onlyRecycler() {
        require(msg.sender != chairperson);
        _;
    }

    constructor() public {
        chairperson = msg.sender;
        symbol = "NBBL";
        name = "The New Bottle Bill";
        decimals = 2;
        _totalSupply = 6600000000000000000000000000;
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
        bottleNums[msg.sender] += n;
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply - balances[address(0)];
    }

    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }
    
    //convert number of bottles into number of tokens and send it to corresponding recycler     
    function transfer(uint tokens) public onlyRecycler validBottles(tokens) returns (bool success) {
        bottleNums[msg.sender] -= tokens;
        uint rankOfUser = ranking[msg.sender];
        if(rankOfUser == 0){
            balances[chairperson] = safeSub(balances[chairperson], tokens);
            balances[msg.sender] = safeAdd(balances[msg.sender], tokens);
            emit Transfer(chairperson, msg.sender, tokens);
        }
        else if(rankOfUser == 1){
            balances[chairperson] = safeSub(balances[chairperson], tokens * 2);
            balances[msg.sender] = safeAdd(balances[msg.sender], tokens * 2);
            emit Transfer(chairperson, msg.sender, tokens * 2);
        }
        else if(rankOfUser == 2){
            balances[chairperson] = safeSub(balances[chairperson], tokens * 3);
            balances[msg.sender] = safeAdd(balances[msg.sender], tokens * 3);
            emit Transfer(chairperson, msg.sender, tokens * 3);
        }
        else if(rankOfUser == 3){
            balances[chairperson] = safeSub(balances[chairperson], tokens * 4);
            balances[msg.sender] = safeAdd(balances[msg.sender], tokens * 4);
            emit Transfer(chairperson, msg.sender, tokens * 4);
        }
        else if(rankOfUser == 4){
            balances[chairperson] = safeSub(balances[chairperson], tokens * 5);
            balances[msg.sender] = safeAdd(balances[msg.sender], tokens * 5);
            emit Transfer(chairperson, msg.sender, tokens * 5);
        }
        else{
            balances[chairperson] = safeSub(balances[chairperson], tokens * 6);
            balances[msg.sender] = safeAdd(balances[msg.sender], tokens * 6);
            emit Transfer(chairperson, msg.sender, tokens * 6);
        }
        return true;
    }

    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function transferFrom(address from, address to, uint tokens) public onlyRecycler returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
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

    function vote(uint organizationNumber, uint tokens) public onlyRecycler validBottles(tokens) validState(State.Active) returns (bool success){
        npos[organizationNumber].voteCount += tokens;
        totalVote += tokens;
        bottleNums[msg.sender] -= tokens;
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
        return winningProposal;
    }

    function sendToNOP() public onlyChair validState(State.Deactive) returns (bool success) {
        uint winner = reqWinner();
        balances[msg.sender] = safeSub(balances[msg.sender], totalVote);
        balances[npos[winner].npoAddress] = safeAdd(balances[npos[winner].npoAddress], totalVote);
        emit Transfer(msg.sender, npos[winner].npoAddress, totalVote);
        totalVote = 0;
        return true;
    }

    function rankingUp(uint num) public onlyRecycler returns (bool success){
        if(bottleNums[msg.sender] >= num * 5){
            bottleNums[msg.sender] -= num * 5;
            if(ranking[msg.sender] == 5){
                return false;
            }
            else{
                balances[chairperson] = safeSub(balances[chairperson], num);
                ranking[msg.sender] = safeAdd(ranking[msg.sender], num);
                return true;
            }
        }
    }

    function showRank() public view onlyRecycler returns (uint rank){
        return ranking[msg.sender];
    }

    function showRestBottles() public onlyRecycler view returns (uint){
        return bottleNums[msg.sender];
    }
}
