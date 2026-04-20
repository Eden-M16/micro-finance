// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Microfinance
 * @dev A decentralized microfinance platform inspired by Ethiopian Iqub/Idir systems.
 * It allows users to lend, borrow, and build credit history on-chain.
 */
contract Microfinance {
    enum LoanStatus { REQUESTED, ACTIVE, REPAYING, COMPLETED, DEFAULTED }

    struct Loan {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 interest;
        uint256 totalRepaid;
        uint256 dueDate;
        LoanStatus status;
        uint256 createdAt;
    }

    struct UserProfile {
        uint256 creditScore; // 0 to 1000
        uint256 totalBorrowed;
        uint256 totalLent;
        uint256[] loanIds;
        bool isRegistered;
    }

    uint256 public nextLoanId;
    uint256 public totalPoolLiquidity;
    uint256 public constant INITIAL_CREDIT_SCORE = 500;
    uint256 public constant MAX_CREDIT_SCORE = 1000;
    uint256 public constant INTEREST_RATE = 5; // 5% flat interest for simplicity

    mapping(address => UserProfile) public users;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256) public deposits;

    event Deposited(address indexed lender, uint256 amount);
    event Withdrawn(address indexed lender, uint256 amount);
    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanFunded(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event RepaymentMade(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanCompleted(uint256 indexed loanId, address indexed borrower);

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    // Re-entrancy Guard
    bool private locked;
    modifier nonReentrant() {
        require(!locked, "Re-entrancy detected");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        nextLoanId = 1;
    }

    /**
     * @dev Register a user if not already registered.
     */
    function registerUser() public {
        if (!users[msg.sender].isRegistered) {
            users[msg.sender].isRegistered = true;
            users[msg.sender].creditScore = INITIAL_CREDIT_SCORE;
        }
    }

    /**
     * @dev Deposit ETH into the lending pool.
     */
    function deposit() public payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        registerUser();

        deposits[msg.sender] += msg.value;
        totalPoolLiquidity += msg.value;
        users[msg.sender].totalLent += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw deposited ETH from the pool.
     */
    function withdraw(uint256 _amount) public nonReentrant {
        require(deposits[msg.sender] >= _amount, "Insufficient balance");
        require(totalPoolLiquidity >= _amount, "Insufficient pool liquidity");

        deposits[msg.sender] -= _amount;
        totalPoolLiquidity -= _amount;

        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, _amount);
    }

    /**
     * @dev Request a loan from the pool.
     */
    function requestLoan(uint256 _amount) public onlyRegistered nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(_amount <= (totalPoolLiquidity * 20) / 100, "Loan request too large (max 20% of pool)");
        
        // Basic credit score check: max loan = creditScore * 0.001 ETH (example)
        uint256 maxLoan = (users[msg.sender].creditScore * 1e15); // 0.001 ETH per point
        require(_amount <= maxLoan, "Loan amount exceeds credit limit");

        // Prevent double borrowing
        for (uint256 i = 0; i < users[msg.sender].loanIds.length; i++) {
            uint256 lid = users[msg.sender].loanIds[i];
            require(loans[lid].status == LoanStatus.COMPLETED || loans[lid].status == LoanStatus.DEFAULTED, "Active loan exists");
        }

        uint256 loanId = nextLoanId++;
        uint256 interest = (_amount * INTEREST_RATE) / 100;

        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            amount: _amount,
            interest: interest,
            totalRepaid: 0,
            dueDate: block.timestamp + 30 days,
            status: LoanStatus.ACTIVE, // Auto-funded for this version if liquidity allows
            createdAt: block.timestamp
        });

        users[msg.sender].loanIds.push(loanId);
        users[msg.sender].totalBorrowed += _amount;
        totalPoolLiquidity -= _amount;

        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Loan transfer failed");

        emit LoanFunded(loanId, msg.sender, _amount);
    }

    /**
     * @dev Repay a loan. Supports partial payments.
     */
    function repayLoan(uint256 _loanId) public payable onlyRegistered nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.borrower == msg.sender, "Not your loan");
        require(loan.status == LoanStatus.ACTIVE || loan.status == LoanStatus.REPAYING, "Loan not active");
        require(msg.value > 0, "Repayment must be greater than 0");

        uint256 totalOwed = loan.amount + loan.interest;
        uint256 remaining = totalOwed - loan.totalRepaid;

        uint256 repaymentAmount = msg.value;
        if (repaymentAmount > remaining) {
            uint256 refund = repaymentAmount - remaining;
            repaymentAmount = remaining;
            (bool success, ) = payable(msg.sender).call{value: refund}("");
            require(success, "Refund failed");
        }

        loan.totalRepaid += repaymentAmount;
        totalPoolLiquidity += repaymentAmount;

        if (loan.totalRepaid >= totalOwed) {
            loan.status = LoanStatus.COMPLETED;
            updateCreditScore(msg.sender, true);
            emit LoanCompleted(_loanId, msg.sender);
        } else {
            loan.status = LoanStatus.REPAYING;
        }

        emit RepaymentMade(_loanId, msg.sender, repaymentAmount);
    }

    /**
     * @dev Internal function to update credit score.
     */
    function updateCreditScore(address _user, bool _onTime) internal {
        if (_onTime) {
            users[_user].creditScore += 50;
            if (users[_user].creditScore > MAX_CREDIT_SCORE) {
                users[_user].creditScore = MAX_CREDIT_SCORE;
            }
        } else {
            if (users[_user].creditScore >= 100) {
                users[_user].creditScore -= 100;
            } else {
                users[_user].creditScore = 0;
            }
        }
    }

    /**
     * @dev Get all loan IDs for a user.
     */
    function getUserLoans(address _user) public view returns (uint256[] memory) {
        return users[_user].loanIds;
    }

    /**
     * @dev Fallback to accept ETH.
     */
    receive() external payable {
        deposit();
    }
}
