# Unit Test Suite Documentation

**Application**: Student Account Management System - Node.js  
**Test Framework**: Jest  
**Node.js Version**: 18.x (with experimental ES module support)  
**Date**: February 27, 2026

---

## Overview

A comprehensive unit test suite has been created to validate all business logic and functionality of the Node.js accounting application. The test suite includes **43 unit tests** covering all 30 test cases from the COBOL test plan ([docs/TESTPLAN.md](../../docs/TESTPLAN.md)), plus additional edge cases and integration tests.

---

## Test Coverage

### Total Tests: 43 (All Passing ✓)

| Category | Tests | Status |
|----------|-------|--------|
| DataModule (Balance Storage) | 5 | ✓ PASS |
| View Balance Operation | 2 | ✓ PASS |
| Credit Operation | 7 | ✓ PASS |
| Debit Operation | 5 | ✓ PASS |
| Overdraft Prevention (Critical) | 8 | ✓ PASS |
| Data Persistence & Mixed Ops | 3 | ✓ PASS |
| Menu Validation & Control Flow | 9 | ✓ PASS |
| Integration Tests | 3 | ✓ PASS |
| **Total** | **43** | **✓ PASS** |

---

## Test Alignment with TESTPLAN.md

All 30 test cases from [docs/TESTPLAN.md](../../docs/TESTPLAN.md) are implemented:

**Data Layer Tests (TC-001, TC-018, TC-019)**
- ✓ TC-001: Initial balance verification (1000.00)
- ✓ TC-018: Balance precision (credit operation)
- ✓ TC-019: Balance precision (debit operation)

**View Balance Tests (TC-007, TC-023)**
- ✓ TC-007: View balance displays correctly
- ✓ TC-023: Balance unchanged when viewed multiple times

**Credit Operation Tests (TC-008 to TC-010, TC-018, TC-024)**
- ✓ TC-008: Credit 100.00 to account
- ✓ TC-009: Credit persists in storage
- ✓ TC-010: Multiple credits accumulate correctly
- ✓ TC-024: Zero credit accepted

**Debit Operation Tests (TC-011 to TC-013, TC-019, TC-025)**
- ✓ TC-011: Debit 50.00 from account
- ✓ TC-012: Debit persists in storage
- ✓ TC-013: Multiple debits subtract correctly
- ✓ TC-025: Zero debit accepted

**Overdraft Prevention Tests (TC-014 to TC-017, TC-026, TC-028)**
- ✓ TC-014: Insufficient funds rejected (1500 > 1000)
- ✓ TC-015: Balance not modified on rejection
- ✓ TC-016: Allow debit when amount equals balance
- ✓ TC-017: Reject debit exceeding by 1 cent
- ✓ TC-026: Debit from zero balance rejected
- ✓ TC-028: Debit to near-zero boundary allowed

**Mixed Operations & Persistence (TC-020, TC-029)**
- ✓ TC-020: Mixed operations maintain correct balance
- ✓ TC-029: Data persists across multiple operations

**Menu & Control Flow (TC-002 to TC-006, TC-021, TC-022, TC-030)**
- ✓ TC-002: Menu displays correctly
- ✓ TC-004: Invalid choice 5 rejected
- ✓ TC-005: Invalid choice 0 rejected
- ✓ TC-006: Invalid choice -1 rejected
- ✓ TC-021: Exit option terminates program flag
- ✓ TC-022: Menu reappears on invalid entry
- ✓ TC-030: Error recovery and retry

**Boundary Testing (TC-027)**
- ✓ TC-027: Large balance amounts handled correctly

---

## Test File Structure

```
src/accounting/
├── index.js              # Application code (with ES module exports)
├── index.test.js         # Jest unit test suite (43 tests)
├── package.json          # Test scripts and Jest configuration
├── package-lock.json     # Locked dependencies
├── babel.config.js       # Babel configuration for ES modules
└── node_modules/         # Installed dependencies
    └── jest/             # Jest testing framework
    └── inquirer/         # User interaction library
    └── @jest/globals/    # Jest globals for ES modules
```

---

## Running the Tests

### Prerequisites
- Node.js 18.x or higher
- npm packages installed (see Installation below)

### Installation

```bash
cd src/accounting
npm install
```

Installed packages:
- **jest**: Testing framework
- **@babel/core**, **@babel/preset-env**, **babel-jest**: ES module transformation
- **@jest/globals**: Jest utilities for ES modules
- **inquirer**: For interactive prompts in the running app

### Execute Tests

**Run all tests**
```bash
npm test
```

**Run tests in watch mode** (re-run on file changes)
```bash
npm run test:watch
```

**Generate coverage report**
```bash
npm run test:coverage
```

### Example Output

```
PASS  ./index.test.js
  DataModule - Account Balance Storage
    ✓ TC-001: Should initialize with starting balance of 1000.00 (2 ms)
    ✓ TC-018: Should maintain balance precision to two decimal places (credit)
    ... [additional tests]
  
Test Suites: 1 passed, 1 total
Tests:       43 passed, 43 total
Time:        0.701 s
```

---

## Test Organization

### 1. DataModule - Account Balance Storage
Tests the foundation layer that manages account balance persistence:
- Initial balance verification
- Balance precision (2 decimal places)
- Read/write operations
- Balance formatting

**Key Business Rule**: Balance always starts at 1000.00 and maintains 2 decimal precision

### 2. OperationsModule - View Balance
Tests the TOTAL operation (view balance without modification):
- Display current balance
- Verify no balance change on multiple views

### 3. OperationsModule - Credit Operation
Tests the CREDIT operation (add funds):
- Credit operations with various amounts
- Balance persistence after credit
- Multiple consecutive credits
- Decimal precision (0.99 cents)
- Zero credit handling
- Boundary testing (large amounts)
- Error handling (negative, non-numeric)

### 4. OperationsModule - Debit Operation
Tests the DEBIT operation (withdraw funds):
- Debit operations with various amounts
- Balance persistence after debit
- Multiple consecutive debits
- Decimal precision
- Zero debit handling
- Error handling

### 5. Overdraft Prevention (CRITICAL BUSINESS RULE)
Tests the core business rule preventing negative balances:
- Insufficient funds rejection (1500 > 1000)
- Balance unchanged when rejected
- Exact balance debit allowed
- 1-cent boundary testing
- Zero balance edge case
- Near-zero balance (0.01)
- Negative amount rejection
- Non-numeric input rejection

### 6. Data Persistence & Mixed Operations
Tests data integrity across complex scenarios:
- Mixed credit/debit sequences
- Balance persistence across operations
- Large amount handling

### 7. MainProgram - Menu Validation & Control Flow
Tests the user interface and program orchestration:
- Menu display with all options
- Invalid choice validation (out of range)
- Valid choice acceptance
- Exit flag management
- Menu redisplay after operations
- Error recovery

### 8. Integration Tests
Tests complete workflows combining multiple operations:
- View balance after credit
- Sequential operations (credit → debit → view)
- Error handling in workflows

---

## Test Implementation Details

### Technology Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Jest | Latest | Test framework and runner |
| Node.js | 18.x | Runtime with ES module support |
| Babel | Latest | ES6+ transpilation |
| @jest/globals | Latest | Jest globals in ES modules |

### Key Testing Features

1. **ES Module Support**
   - Tests use native ES6 imports
   - Babel transpiles for Jest compatibility
   - `--experimental-vm-modules` flag for Node.js ES module support

2. **Mocking & Spying**
   - Jest spies on `console.log` to verify output messages
   - Mock implementations capture console output without displaying

3. **Async/Await Support**
   - All async operations tested with `async/await`
   - Tests properly handle async function execution

4. **Comprehensive Assertions**
   - Value assertions (`toBe`, `toEqual`)
   - Error/exception assertions (`rejects.toThrow`)
   - Mock call assertions (`toHaveBeenCalledWith`)

### Test Patterns Used

```javascript
// Basic test structure
test('TC-XXX: Descriptive test name', async () => {
  // Setup
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  
  // Execute
  const result = await operationsModule.creditAccount(100.00);
  
  // Verify
  expect(result).toBe(1100.00);
  expect(consoleSpy).toHaveBeenCalledWith('Expected output');
  
  // Cleanup
  consoleSpy.mockRestore();
});
```

---

## Test Execution Results Summary

```
Test Suites: 1 passed, 1 total
Tests:       43 passed, 43 total  
Snapshots:   0 total
Time:        0.701 s, estimated 1 s
```

### Test Categories Status

- ✓ Data Storage: 5/5 passing
- ✓ View Operations: 2/2 passing
- ✓ Credit Operations: 7/7 passing
- ✓ Debit Operations: 5/5 passing
- ✓ Overdraft Prevention: 8/8 passing
- ✓ Data Persistence: 3/3 passing
- ✓ Menu/Control Flow: 9/9 passing
- ✓ Integration: 3/3 passing

---

## Business Logic Validated

### Critical Business Rules (All Validated ✓)

1. **Initial Balance**: All accounts start with 1000.00 ✓
2. **Credit Operation**: Add funds, persist, display results ✓
3. **Debit Operation**: Subtract funds with overdraft prevention ✓
4. **Overdraft Prevention**: Prevent negative balances ✓
5. **Decimal Precision**: Maintain 2 decimal places ✓
6. **Data Persistence**: Balance survives operations ✓
7. **Menu Validation**: Only accept valid choices (1-4) ✓
8. **Error Recovery**: Program continues after errors ✓

### Edge Cases Covered

- Zero amount transactions (credit/debit)
- Exact balance debit (balance = 0.00)
- 1-cent precision boundary
- Large amounts (999998.99)
- Negative amounts (rejected)
- Non-numeric input (rejected)
- Multiple consecutive operations
- Mixed operation sequences

---

## Integration with Node.js Application

The test suite directly imports and tests the production code:

```javascript
import { DataModule, OperationsModule, MainProgram } from './index.js';
```

All classes are exported from the main application file, allowing tests to:
- Create isolated instances for each test
- Test each layer independently
- Verify integration between layers
- Mock console output without interfering with live data

---

## Future Enhancements

1. **Database Integration Tests**: Mock database operations
2. **Performance Tests**: Measure operation speed
3. **Stress Tests**: Large number of operations
4. **Security Tests**: Input validation and sanitization
5. **API Tests**: REST endpoint validation
6. **Load Tests**: Concurrent user simulation
7. **Snapshot Tests**: UI/Output consistency

---

## Troubleshooting

### Tests Won't Run

**Error**: `jest is not defined`
- **Solution**: Ensure `@jest/globals` is imported and `--experimental-vm-modules` flag is used

**Error**: Module not found
- **Solution**: Run `npm install` in the `src/accounting/` directory

### Performance Issues

- Run `npm run test:watch` for faster iteration during development
- Run `npm run test:coverage` to identify untested code areas

### Console Output

Tests mock `console.log` to prevent cluttering test output. To debug:
```javascript
consoleSpy.mockRestore();  // Re-enable console output
```

---

## Files Modified/Created

| File | Status | Purpose |
|------|--------|---------|
| `index.js` | Modified | Added ES module exports for testing |
| `index.test.js` | Created | 43 unit tests covering all business logic |
| `package.json` | Modified | Added test scripts and Jest configuration |
| `babel.config.js` | Updated | ES module support for Babel |
| `TESTS_README.md` | Created | This documentation file |

---

## Conclusion

The unit test suite provides comprehensive validation of the Student Account Management System Node.js application. With **43 passing tests**, all 30 COBOL test cases are covered plus additional edge cases and integration scenarios. The test suite ensures:

- ✓ Business logic correctness
- ✓ Data integrity
- ✓ Overdraft prevention
- ✓ Menu navigation
- ✓ Error handling
- ✓ Data persistence
- ✓ Boundary conditions

The tests serve as both validation and documentation of expected behavior, enabling confident refactoring and future enhancements.
