/**
 * Unit Tests for Student Account Management System
 * 
 * This test suite mirrors all 30 test cases from docs/TESTPLAN.md
 * Tests verify business logic and data integrity of the Node.js application
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { DataModule, OperationsModule, MainProgram } from './index.js';

// ============================================================================
// TEST SUITE: DATA MODULE (Foundation - Balance Storage)
// ============================================================================

describe('DataModule - Account Balance Storage', () => {
  let dataModule;

  beforeEach(() => {
    dataModule = new DataModule();
  });

  // TC-001: Verify application starts with initial balance of 1000.00
  test('TC-001: Should initialize with starting balance of 1000.00', () => {
    const balance = dataModule.read();
    expect(balance).toBe(1000.00);
  });

  // TC-018: Verify balance precision to two decimal places - credit operation
  test('TC-018: Should maintain balance precision to two decimal places (credit)', () => {
    dataModule.write(1000.99);
    const balance = dataModule.read();
    expect(balance).toBe(1000.99);
    expect(balance.toFixed(2)).toBe('1000.99');
  });

  // TC-019: Verify balance precision to two decimal places - debit operation
  test('TC-019: Should maintain balance precision to two decimal places (debit)', () => {
    dataModule.write(999.50);
    const balance = dataModule.read();
    expect(balance).toBe(999.50);
    expect(balance.toFixed(2)).toBe('999.50');
  });

  // Additional: Test formatted balance getter
  test('Should return formatted balance string', () => {
    dataModule.write(1234.56);
    expect(dataModule.getFormattedBalance()).toBe('1234.56');
  });

  // Additional: Test write operation persists balance
  test('Should persist balance through read-write operations', () => {
    const newBalance = 5000.75;
    dataModule.write(newBalance);
    const retrieved = dataModule.read();
    expect(retrieved).toBe(newBalance);
  });
});

// ============================================================================
// TEST SUITE: OPERATIONS MODULE - VIEW BALANCE
// ============================================================================

describe('OperationsModule - View Balance Operation (TOTAL)', () => {
  let dataModule;
  let operationsModule;

  beforeEach(() => {
    dataModule = new DataModule();
    operationsModule = new OperationsModule(dataModule);
  });

  // TC-007: Verify View Balance operation (Option 1) displays current balance
  test('TC-007: Should display current balance correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const balance = await operationsModule.viewBalance();
    expect(balance).toBe(1000.00);
    expect(consoleSpy).toHaveBeenCalledWith('\nCurrent balance: 1000.00');
    consoleSpy.mockRestore();
  });

  // TC-023: Verify balance remains unchanged when View Balance is called
  test('TC-023: Should not modify balance when viewed multiple times', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const balance1 = await operationsModule.viewBalance();
    const balance2 = await operationsModule.viewBalance();
    expect(balance1).toBe(balance2);
    expect(balance1).toBe(1000.00);
    consoleSpy.mockRestore();
  });
});

// ============================================================================
// TEST SUITE: OPERATIONS MODULE - CREDIT OPERATION
// ============================================================================

describe('OperationsModule - Credit Operation (ADD FUNDS)', () => {
  let dataModule;
  let operationsModule;

  beforeEach(() => {
    dataModule = new DataModule();
    operationsModule = new OperationsModule(dataModule);
  });

  // TC-008: Verify Credit operation (Option 2) - add 100.00 to account
  test('TC-008: Should credit 100.00 to account with initial balance 1000.00', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const newBalance = await operationsModule.creditAccount(100.00);
    expect(newBalance).toBe(1100.00);
    expect(consoleSpy).toHaveBeenCalledWith('\nAmount credited. New balance: 1100.00');
    consoleSpy.mockRestore();
  });

  // TC-009: Verify Credit operation updates balance in storage
  test('TC-009: Should persist credited balance in storage', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await operationsModule.creditAccount(100.00);
    const persistedBalance = dataModule.read();
    expect(persistedBalance).toBe(1100.00);
    consoleSpy.mockRestore();
  });

  // TC-010: Verify multiple consecutive credit operations accumulate correctly
  test('TC-010: Should accumulate multiple consecutive credits correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await operationsModule.creditAccount(100.00); // 1100.00
    await operationsModule.creditAccount(200.00); // 1300.00
    await operationsModule.creditAccount(150.00); // 1450.00
    const finalBalance = dataModule.read();
    expect(finalBalance).toBe(1450.00);
    consoleSpy.mockRestore();
  });

  // TC-018: Verify balance precision to two decimal places - credit operation
  test('TC-018: Should maintain precision with credit of 0.99', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const newBalance = await operationsModule.creditAccount(0.99);
    expect(newBalance).toBe(1000.99);
    expect(newBalance.toFixed(2)).toBe('1000.99');
    consoleSpy.mockRestore();
  });

  // TC-024: Verify zero credit amount is accepted
  test('TC-024: Should accept zero credit amount without modifying balance', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const newBalance = await operationsModule.creditAccount(0.00);
    expect(newBalance).toBe(1000.00);
    expect(consoleSpy).toHaveBeenCalledWith('\nAmount credited. New balance: 1000.00');
    consoleSpy.mockRestore();
  });

  // Additional: Test credit with large amount (boundary testing)
  test('Should credit large amount correctly (boundary test)', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const newBalance = await operationsModule.creditAccount(999998.99);
    expect(newBalance).toBe(1000998.99); // 1000 + 999998.99 = 1000998.99
    consoleSpy.mockRestore();
  });

  // Additional: Test credit with negative amount should throw error
  test('Should reject negative credit amount', async () => {
    await expect(operationsModule.creditAccount(-100.00)).rejects.toThrow(
      'Amount must be a positive number'
    );
  });

  // Additional: Test credit with NaN should throw error
  test('Should reject non-numeric credit amount', async () => {
    await expect(operationsModule.creditAccount('abc')).rejects.toThrow(
      'Amount must be a positive number'
    );
  });
});

// ============================================================================
// TEST SUITE: OPERATIONS MODULE - DEBIT OPERATION
// ============================================================================

describe('OperationsModule - Debit Operation (WITHDRAW FUNDS)', () => {
  let dataModule;
  let operationsModule;

  beforeEach(() => {
    dataModule = new DataModule();
    operationsModule = new OperationsModule(dataModule);
  });

  // TC-011: Verify Debit operation (Option 3) - subtract 50.00 from account
  test('TC-011: Should debit 50.00 from account with initial balance 1000.00', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await operationsModule.debitAccount(50.00);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(950.00);
    expect(consoleSpy).toHaveBeenCalledWith('\nAmount debited. New balance: 950.00');
    consoleSpy.mockRestore();
  });

  // TC-012: Verify Debit operation updates balance in storage
  test('TC-012: Should persist debited balance in storage', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await operationsModule.debitAccount(50.00);
    const persistedBalance = dataModule.read();
    expect(persistedBalance).toBe(950.00);
    consoleSpy.mockRestore();
  });

  // TC-013: Verify multiple consecutive debit operations subtract correctly
  test('TC-013: Should subtract multiple consecutive debits correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await operationsModule.debitAccount(100.00); // 900.00
    await operationsModule.debitAccount(150.00); // 750.00
    await operationsModule.debitAccount(200.00); // 550.00
    const finalBalance = dataModule.read();
    expect(finalBalance).toBe(550.00);
    consoleSpy.mockRestore();
  });

  // TC-019: Verify balance precision to two decimal places - debit operation
  test('TC-019: Should maintain precision with debit of 0.50', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await operationsModule.debitAccount(0.50);
    expect(result.newBalance).toBe(999.50);
    expect(result.newBalance.toFixed(2)).toBe('999.50');
    consoleSpy.mockRestore();
  });

  // TC-025: Verify zero debit amount is accepted
  test('TC-025: Should accept zero debit amount without modifying balance', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await operationsModule.debitAccount(0.00);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(1000.00);
    expect(consoleSpy).toHaveBeenCalledWith('\nAmount debited. New balance: 1000.00');
    consoleSpy.mockRestore();
  });
});

// ============================================================================
// TEST SUITE: OVERDRAFT PREVENTION (Critical Business Rule)
// ============================================================================

describe('OperationsModule - Overdraft Prevention (CRITICAL BUSINESS RULE)', () => {
  let dataModule;
  let operationsModule;

  beforeEach(() => {
    dataModule = new DataModule();
    operationsModule = new OperationsModule(dataModule);
  });

  // TC-014: Verify Debit operation with insufficient funds is rejected
  test('TC-014: Should reject debit when amount exceeds balance (1500.00 > 1000.00)', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await operationsModule.debitAccount(1500.00);
    expect(result.success).toBe(false);
    expect(result.newBalance).toBe(1000.00);
    expect(consoleSpy).toHaveBeenCalledWith('\nInsufficient funds for this debit.');
    consoleSpy.mockRestore();
  });

  // TC-015: Verify balance not modified when insufficient funds
  test('TC-015: Should not modify balance when debit is rejected', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await operationsModule.debitAccount(1500.00);
    const balanceAfterRejection = dataModule.read();
    expect(balanceAfterRejection).toBe(1000.00);
    consoleSpy.mockRestore();
  });

  // TC-016: Verify overdraft prevention with exact balance amount
  test('TC-016: Should allow debit when amount equals balance (1000.00 == 1000.00)', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await operationsModule.debitAccount(1000.00);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(0.00);
    expect(consoleSpy).toHaveBeenCalledWith('\nAmount debited. New balance: 0.00');
    consoleSpy.mockRestore();
  });

  // TC-017: Verify Debit rejected when amount exceeds remaining balance by 1 cent
  test('TC-017: Should reject debit exceeding balance by 1 cent (1000.01 > 1000.00)', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await operationsModule.debitAccount(1000.01);
    expect(result.success).toBe(false);
    expect(result.newBalance).toBe(1000.00);
    expect(consoleSpy).toHaveBeenCalledWith('\nInsufficient funds for this debit.');
    consoleSpy.mockRestore();
  });

  // TC-026: Verify debit when balance equals zero is rejected
  test('TC-026: Should reject debit when balance is zero', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    dataModule.write(0.00);
    const result = await operationsModule.debitAccount(0.01);
    expect(result.success).toBe(false);
    expect(result.newBalance).toBe(0.00);
    expect(consoleSpy).toHaveBeenCalledWith('\nInsufficient funds for this debit.');
    consoleSpy.mockRestore();
  });

  // TC-028: Verify debit reduces balance to near-zero boundary
  test('TC-028: Should allow debit reducing balance to 0.01', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await operationsModule.debitAccount(999.99);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(0.01);
    expect(consoleSpy).toHaveBeenCalledWith('\nAmount debited. New balance: 0.01');
    consoleSpy.mockRestore();
  });

  // Additional: Test negative debit should throw error
  test('Should reject negative debit amount', async () => {
    await expect(operationsModule.debitAccount(-100.00)).rejects.toThrow(
      'Amount must be a positive number'
    );
  });

  // Additional: Test NaN debit should throw error
  test('Should reject non-numeric debit amount', async () => {
    await expect(operationsModule.debitAccount('xyz')).rejects.toThrow(
      'Amount must be a positive number'
    );
  });
});

// ============================================================================
// TEST SUITE: DATA PERSISTENCE AND MIXED OPERATIONS
// ============================================================================

describe('OperationsModule - Data Persistence and Mixed Operations', () => {
  let dataModule;
  let operationsModule;

  beforeEach(() => {
    dataModule = new DataModule();
    operationsModule = new OperationsModule(dataModule);
  });

  // TC-020: Verify mixed operations maintain correct balance
  test('TC-020: Should correctly maintain balance through mixed operations', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // 1. Credit 500.00 (balance = 1500.00)
    await operationsModule.creditAccount(500.00);
    expect(dataModule.read()).toBe(1500.00);
    
    // 2. Debit 200.00 (balance = 1300.00)
    await operationsModule.debitAccount(200.00);
    expect(dataModule.read()).toBe(1300.00);
    
    // 3. Credit 100.00 (balance = 1400.00)
    await operationsModule.creditAccount(100.00);
    expect(dataModule.read()).toBe(1400.00);
    
    // 4. Debit 150.00 (balance = 1250.00)
    await operationsModule.debitAccount(150.00);
    expect(dataModule.read()).toBe(1250.00);
    
    // 5. View Balance
    const finalBalance = dataModule.read();
    expect(finalBalance).toBe(1250.00);
    
    consoleSpy.mockRestore();
  });

  // TC-029: Verify data persistence across multiple menu cycles
  test('TC-029: Should persist balance changes across multiple operations', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Credit 100.00
    await operationsModule.creditAccount(100.00);
    let persistedBalance = dataModule.read();
    expect(persistedBalance).toBe(1100.00);
    
    // Debit 50.00
    await operationsModule.debitAccount(50.00);
    persistedBalance = dataModule.read();
    expect(persistedBalance).toBe(1050.00);
    
    // View Balance (verify persistence)
    const finalBalance = await operationsModule.viewBalance();
    expect(finalBalance).toBe(1050.00);
    
    consoleSpy.mockRestore();
  });

  // TC-027: Verify maximum balance can be set (boundary testing)
  test('TC-027: Should handle large balance amounts (boundary test)', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await operationsModule.creditAccount(999998.99);
    const balance = dataModule.read();
    expect(balance).toBe(1000998.99); // 1000 + 999998.99 = 1000998.99
    consoleSpy.mockRestore();
  });
});

// ============================================================================
// TEST SUITE: MAIN PROGRAM - MENU VALIDATION & CONTROL FLOW
// ============================================================================

describe('MainProgram - Menu Validation and Control Flow', () => {
  let mainProgram;

  beforeEach(() => {
    mainProgram = new MainProgram();
  });

  // TC-002: Verify menu displays correctly on startup
  test('TC-002: Should display menu with all options', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    mainProgram.displayMenu();
    expect(consoleSpy).toHaveBeenCalledWith('--------------------------------');
    expect(consoleSpy).toHaveBeenCalledWith('Account Management System');
    expect(consoleSpy).toHaveBeenCalledWith('1. View Balance');
    expect(consoleSpy).toHaveBeenCalledWith('2. Credit Account');
    expect(consoleSpy).toHaveBeenCalledWith('3. Debit Account');
    expect(consoleSpy).toHaveBeenCalledWith('4. Exit');
    consoleSpy.mockRestore();
  });

  // TC-004: Verify invalid menu choice (numeric outside 1-4) is rejected
  test('TC-004: Should reject invalid choice 5', () => {
    expect(mainProgram.isValidChoice(5)).toBe(false);
  });

  // TC-005: Verify invalid menu choice (zero) is rejected
  test('TC-005: Should reject invalid choice 0', () => {
    expect(mainProgram.isValidChoice(0)).toBe(false);
  });

  // TC-006: Verify invalid menu choice (negative number) is rejected
  test('TC-006: Should reject negative choice -1', () => {
    expect(mainProgram.isValidChoice(-1)).toBe(false);
  });

  // Additional: Test all valid choices are accepted
  test('Should accept all valid choices 1-4', () => {
    expect(mainProgram.isValidChoice(1)).toBe(true);
    expect(mainProgram.isValidChoice(2)).toBe(true);
    expect(mainProgram.isValidChoice(3)).toBe(true);
    expect(mainProgram.isValidChoice(4)).toBe(true);
  });

  // TC-021: Verify Exit option (Option 4) terminates program
  test('TC-021: Should set continue flag to false on exit', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    expect(mainProgram.continueFlag).toBe(true);
    await mainProgram.processUserChoice(4);
    expect(mainProgram.continueFlag).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Exiting the program. Goodbye!\n');
    consoleSpy.mockRestore();
  });

  // TC-003: Verify menu reappears after each operation (implicit in infinite loop design)
  test('TC-003: Should handle option 1 (View Balance) without terminating', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    expect(mainProgram.continueFlag).toBe(true);
    await mainProgram.processUserChoice(1);
    expect(mainProgram.continueFlag).toBe(true); // Still running after operation
    consoleSpy.mockRestore();
  });

  // TC-022: Verify program returns to menu after invalid entry
  test('TC-022: Should display error and stay running on invalid choice', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    expect(mainProgram.continueFlag).toBe(true);
    await mainProgram.processUserChoice(999);
    expect(consoleSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    expect(mainProgram.continueFlag).toBe(true); // Program continues running
    consoleSpy.mockRestore();
  });

  // TC-030: Verify error message and recovery after invalid selection
  test('TC-030: Should recover and execute valid operation after invalid choice', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Invalid choice
    await mainProgram.processUserChoice(99);
    expect(consoleSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    
    // Valid choice should execute successfully
    const balance = await mainProgram.operationsModule.viewBalance();
    expect(balance).toBe(1000.00);
    
    consoleSpy.mockRestore();
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Integration Tests - Complete Workflows', () => {
  let mainProgram;

  beforeEach(() => {
    mainProgram = new MainProgram();
  });

  // Integration: View Balance after Credit
  test('Should view updated balance after credit operation', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Credit 500.00
    await mainProgram.operationsModule.creditAccount(500.00);
    
    // View balance
    const balance = await mainProgram.operationsModule.viewBalance();
    
    expect(balance).toBe(1500.00);
    consoleSpy.mockRestore();
  });

  // Integration: Sequential Operations Workflow
  test('Should handle complete workflow: Credit, Debit, View Balance', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Step 1: Display menu
    mainProgram.displayMenu();
    expect(mainProgram.continueFlag).toBe(true);
    
    // Step 2: Credit 300.00
    await mainProgram.operationsModule.creditAccount(300.00);
    expect(mainProgram.dataModule.read()).toBe(1300.00);
    
    // Step 3: Display menu again
    mainProgram.displayMenu();
    expect(mainProgram.continueFlag).toBe(true);
    
    // Step 4: Debit 200.00
    const debitResult = await mainProgram.operationsModule.debitAccount(200.00);
    expect(debitResult.success).toBe(true);
    expect(mainProgram.dataModule.read()).toBe(1100.00);
    
    // Step 5: View balance
    const finalBalance = await mainProgram.operationsModule.viewBalance();
    expect(finalBalance).toBe(1100.00);
    
    consoleSpy.mockRestore();
  });

  // Integration: Handle Insufficient Funds in Workflow
  test('Should handle insufficient funds gracefully in workflow', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Attempt to debit more than available
    const result1 = await mainProgram.operationsModule.debitAccount(2000.00);
    expect(result1.success).toBe(false);
    expect(mainProgram.dataModule.read()).toBe(1000.00);
    
    // Program should recover and allow valid operation
    const result2 = await mainProgram.operationsModule.debitAccount(500.00);
    expect(result2.success).toBe(true);
    expect(mainProgram.dataModule.read()).toBe(500.00);
    
    consoleSpy.mockRestore();
  });
});

// ============================================================================
// TEST SUMMARY
// ============================================================================

/*
 * Test Coverage Summary - All 30 Test Cases from TESTPLAN.md Covered:
 * 
 * TC-001 ✓ Initial balance 1000.00
 * TC-002 ✓ Menu display
 * TC-003 ✓ Menu reappears after operations
 * TC-004 ✓ Invalid choice rejection (> 4)
 * TC-005 ✓ Invalid choice rejection (0)
 * TC-006 ✓ Invalid choice rejection (< 0)
 * TC-007 ✓ View balance displays correctly
 * TC-008 ✓ Credit 100.00
 * TC-009 ✓ Credit persists in storage
 * TC-010 ✓ Multiple credits accumulate
 * TC-011 ✓ Debit 50.00
 * TC-012 ✓ Debit persists in storage
 * TC-013 ✓ Multiple debits subtract correctly
 * TC-014 ✓ Insufficient funds rejection
 * TC-015 ✓ Balance not modified on rejection
 * TC-016 ✓ Overdraft with exact amount allowed
 * TC-017 ✓ Debit exceeding by 1 cent rejected
 * TC-018 ✓ Balance precision (credit)
 * TC-019 ✓ Balance precision (debit)
 * TC-020 ✓ Mixed operations
 * TC-021 ✓ Exit terminates
 * TC-022 ✓ Menu reappears on invalid entry
 * TC-023 ✓ Balance unchanged when viewed
 * TC-024 ✓ Zero credit accepted
 * TC-025 ✓ Zero debit accepted
 * TC-026 ✓ Debit from zero balance rejected
 * TC-027 ✓ Large balance handling (boundary)
 * TC-028 ✓ Debit to near-zero (boundary)
 * TC-029 ✓ Data persistence across cycles
 * TC-030 ✓ Error recovery and retry
 * 
 * Total: 30/30 Test Cases Implemented
 * Status: COMPLETE
 */
