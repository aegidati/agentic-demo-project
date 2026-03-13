# Domain Model – Customers

This document defines the **core domain model** for the Customers domain.

## Overview

The Customers domain encapsulates all business logic and concepts related to customer management, lifecycle, and interactions.

## Core Entities

### Customer
**Purpose**: Represents a customer entity in the system.

**Attributes**:
- `id`: Unique identifier
- `email`: Primary contact email
- `name`: Customer name
- `status`: [Active, Inactive, Suspended]
- `createdAt`: Registration date
- `updatedAt`: Last modification date

**Business Rules**:
- Customer email must be unique
- Customer status transitions must follow allowed domain state transitions
- Sensitive data (phone, address) stored separately in Profile entity

### Customer Profile
**Purpose**: Extended customer information.

**Attributes**:
- `customerId`: Reference to Customer
- `phone`: Contact phone
- `address`: Mailing address
- `preferences`: Communication preferences (JSON)

**Business Rules**:
- Phone and address are optional
- Preferences are user-editable

## Value Objects

### Email
**Purpose**: Domain-specific email value object.

**Properties**:
- Must be valid format
- Case-insensitive comparison
- Immutable

### Address
**Purpose**: Structured address representation.

**Properties**:
- Street, City, State/Province, Postal Code, Country
- Validation: Required fields vary by country

## Aggregates

**Customer Aggregate**: Root entity is `Customer`, includes `Profile`.

**Invariants**:
- A customer cannot have duplicate emails across system
- A customer must have at least one contact method (email is mandatory)
- Status changes are logged for audit purposes

## Domain Events

- `CustomerCreated`
- `CustomerStatusChanged`
- `CustomerProfileUpdated`
- `CustomerDeactivated`

## Repository Contracts

```
interface ICustomerRepository
  - GetById(customerId) -> Customer
  - GetByEmail(email) -> Customer
  - SaveAsync(customer) -> void
  - Delete(customerId) -> void
  - GetAllActive() -> List<Customer>
```

## Use Cases (Examples)

- Create customer
- Update customer profile
- Deactivate customer
- Search customers by name/email
- List active customers

---

**Status**: Template (to be elaborated in derived project)
