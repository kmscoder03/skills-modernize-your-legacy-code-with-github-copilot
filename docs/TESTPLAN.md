# Student Account Management System - Test Plan

**Application:** Student Account Management System (COBOL)  
**Version:** 1.0  
**Date Created:** February 27, 2026  
**Purpose:** Comprehensive test plan to validate business logic and implementation

---

## Test Case Overview

This test plan covers all business logic and functionality of the Student Account Management System, including:
- Account balance initialization and retrieval
- Credit operations (deposits)
- Debit operations (withdrawals) with overdraft prevention
- Menu navigation and input validation
- Data persistence across operations

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Verify application starts with initial balance of 1000.00 | System is initialized | 1. Run application<br>2. Select option 1 (View Balance) | Display shows balance of 1000.00 | | | |
| TC-002 | Verify menu displays correctly on startup | Application starts | 1. Run application | Menu displays options: 1. View Balance, 2. Credit Account, 3. Debit Account, 4. Exit | | | |
| TC-003 | Verify menu reappears after each operation | Application is running | 1. Run application<br>2. Select option 1 (View Balance)<br>3. Observe screen | Menu should redisplay after operation completes | | | |
| TC-004 | Verify invalid menu choice (numeric outside 1-4) is rejected | Application running with menu displayed | 1. Enter choice: 5<br>2. Observe response | Error message "Invalid choice, please select 1-4." displays and menu reappears | | | |
| TC-005 | Verify invalid menu choice (zero) is rejected | Application running with menu displayed | 1. Enter choice: 0<br>2. Observe response | Error message "Invalid choice, please select 1-4." displays and menu reappears | | | |
| TC-006 | Verify invalid menu choice (negative number) is rejected | Application running with menu displayed | 1. Enter choice: -1<br>2. Observe response | Error message "Invalid choice, please select 1-4." displays and menu reappears | | | |
| TC-007 | Verify View Balance operation (Option 1) displays current balance | Initial balance is 1000.00 | 1. Select option 1 (View Balance) | Display shows "Current balance: 1000.00" | | | |
| TC-008 | Verify Credit operation (Option 2) - add 100.00 to account | Initial balance is 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 100.00<br>3. Observe balance | Display shows "Amount credited. New balance: 1100.00" | | | |
| TC-009 | Verify Credit operation updates balance in storage | Initial balance is 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 100.00<br>3. Select option 1 (View Balance) | New balance is 1100.00 (persisted from previous operation) | | | |
| TC-010 | Verify multiple consecutive credit operations accumulate correctly | Initial balance is 1000.00 | 1. Credit 100.00 (balance = 1100.00)<br>2. Credit 200.00 (balance = 1300.00)<br>3. Credit 150.00 (balance = 1450.00)<br>4. View Balance | Final balance is 1450.00 | | | |
| TC-011 | Verify Debit operation (Option 3) - subtract 50.00 from account | Initial balance is 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 50.00<br>3. Observe balance | Display shows "Amount debited. New balance: 950.00" | | | |
| TC-012 | Verify Debit operation updates balance in storage | Initial balance is 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 50.00<br>3. Select option 1 (View Balance) | New balance is 950.00 (persisted from previous operation) | | | |
| TC-013 | Verify multiple consecutive debit operations subtract correctly | Initial balance is 1000.00 | 1. Debit 100.00 (balance = 900.00)<br>2. Debit 150.00 (balance = 750.00)<br>3. Debit 200.00 (balance = 550.00)<br>4. View Balance | Final balance is 550.00 | | | |
| TC-014 | Verify Debit operation with insufficient funds is rejected | Initial balance is 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 1500.00<br>3. Observe response | Display shows "Insufficient funds for this debit." and balance remains 1000.00 | | | |
| TC-015 | Verify balance not modified when insufficient funds | Initial balance is 1000.00 | 1. Attempt debit 1500.00<br>2. Select option 1 (View Balance) | Balance remains 1000.00 (transaction rejected) | | | |
| TC-016 | Verify overdraft prevention with exact balance amount | Initial balance is 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 1000.00<br>3. Observe response | Display shows "Amount debited. New balance: 0.00" (transaction allowed, balance = 0) | | | |
| TC-017 | Verify Debit rejected when amount exceeds remaining balance by 1 cent | Initial balance is 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 1000.01<br>3. Observe response | Display shows "Insufficient funds for this debit." and balance remains 1000.00 | | | |
| TC-018 | Verify balance precision to two decimal places - credit operation | Initial balance is 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 0.99<br>3. View Balance | Display shows "Current balance: 1000.99" | | | |
| TC-019 | Verify balance precision to two decimal places - debit operation | Initial balance is 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 0.50<br>3. View Balance | Display shows "Current balance: 999.50" | | | |
| TC-020 | Verify mixed operations maintain correct balance | Initial balance is 1000.00 | 1. Credit 500.00 (balance = 1500.00)<br>2. Debit 200.00 (balance = 1300.00)<br>3. Credit 100.00 (balance = 1400.00)<br>4. Debit 150.00 (balance = 1250.00)<br>5. View Balance | Final balance is 1250.00 | | | |
| TC-021 | Verify Exit option (Option 4) terminates program | Application running with menu displayed | 1. Select option 4 (Exit)<br>2. Observe screen | Display shows "Exiting the program. Goodbye!" and program terminates | | | |
| TC-022 | Verify program returns to menu after invalid entry | Application running with menu displayed | 1. Enter invalid choice (non-numeric or > 4)<br>2. Observe if menu reappears | Error message displays, menu reappears for next input | | | |
| TC-023 | Verify balance remains unchanged when View Balance is called | Current balance is 500.00 | 1. Select option 1 (View Balance)<br>2. Select option 1 (View Balance) again<br>3. Observe both results | Both displays show balance of 500.00 (no change) | | | |
| TC-024 | Verify zero credit amount is accepted | Initial balance is 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 0.00<br>3. View Balance | Display shows "Amount credited. New balance: 1000.00" (no change) | | | |
| TC-025 | Verify zero debit amount is accepted | Initial balance is 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 0.00<br>3. View Balance | Display shows "Amount debited. New balance: 1000.00" (no change) | | | |
| TC-026 | Verify debit when balance equals zero is rejected | Balance is 0.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 0.01<br>3. Observe response | Display shows "Insufficient funds for this debit." | | | |
| TC-027 | Verify maximum balance can be set (boundary testing) | Initial balance is 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 999998.99<br>3. View Balance | Display shows "Amount credited. New balance: 1000999.99" | | | |
| TC-028 | Verify debit reduces balance to near-zero boundary | Initial balance is 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 999.99<br>3. View Balance | Display shows "Amount debited. New balance: 0.01" | | | |
| TC-029 | Verify data persistence across multiple menu cycles | Initial balance is 1000.00 | 1. Credit 100.00<br>2. Exit to menu<br>3. Debit 50.00<br>4. Exit to menu<br>5. View Balance | Final balance is 1050.00, confirming persistence across operations | | | |
| TC-030 | Verify error message and recovery after invalid selection | Application running | 1. Enter choice: 99<br>2. Enter choice: 1 (View Balance) | Error message displays, then application successfully executes View Balance after re-entry | | | |

---

## Test Execution Notes

### Critical Test Areas
- **Balance Initialization**: Verify starting balance of 1000.00 is always used
- **Overdraft Prevention**: Verify debit operations cannot result in negative balance
- **Data Persistence**: Verify balance changes persist across multiple operations
- **Input Validation**: Verify menu accepts only valid choices (1-4)
- **Precision**: Verify currency amounts maintain two decimal places

### Known Limitations for Testing
- Current COBOL implementation uses in-memory storage (no database)
- No authentication or user identification (single account system)
- No transaction history or audit logging
- Balance does not persist between program restarts

### Notes for Node.js Modernization
This test plan can be directly adapted for Node.js implementation:
- Replicate all 30 test cases with Jest, Mocha, or similar testing frameworks
- Implement unit tests for individual operations (view, credit, debit)
- Implement integration tests for menu navigation and data flow
- Add database persistence tests (replacing in-memory storage)
- Consider adding security tests (authentication, authorization)
- Add performance and load testing considerations

---

## Test Execution Summary

| Total Test Cases | Pass | Fail | Not Executed |
|---|---|---|---|
| 30 | | | |

**Overall Status:** Pending Execution

**Test Execution Date:** [To be filled during testing]  
**Executed By:** [To be filled during testing]  
**Approved By:** [To be filled after stakeholder review]
