You are a senior Full Stack Software Architect and Engineer.

Build a complete production-ready Financial Management Platform for a company.

IMPORTANT RULES
- Website language: Persian (Farsi, RTL)
- UI must be completely Right-to-Left (RTL).
- All dates must support the Persian (Jalali) calendar.
- Currency is Iranian Rial (IRR) with proper thousand separators.
- Code must be clean, modular, scalable and documented.

=========================================
TECH STACK (DO NOT USE ANYTHING ELSE)
=========================================

Backend
- Node.js
- Express.js
- TypeScript

Frontend
- React
- Vite
- TypeScript

Database
- MySQL

Authentication
- OAuth

Do NOT use:
- Docker
- Kubernetes
- Redis
- RabbitMQ
- MongoDB
- PostgreSQL
- Next.js
- NestJS
- Prisma
- Firebase
- Supabase

Only use:
Node.js + Express.js + React + Vite + TypeScript + MySQL + OAuth

=========================================
PROJECT GOAL
=========================================

Create a complete Accounting and Financial Management System for a company.

The system manages:

- Company income
- Company expenses
- Employee salaries
- Employee bonuses
- Employee reimbursements
- Purchases
- Office costs
- Operational costs
- Tax
- Profit & Loss
- Financial Reports

Everything must be stored in MySQL.

=========================================
DEFAULT TAX
=========================================

Default tax is

9%

Every financial operation should support tax calculation.

Tax must be enabled by default.

Administrator can change tax percentage in Settings.

=========================================
USER ROLES
=========================================

Create Role Based Access Control.

Roles:

Administrator

Permissions

- Full access
- Manage users
- Manage roles
- Settings
- Reports
- Employees
- Categories
- Financial records
- Export files

-----------------------------------------

Accountant

Permissions

- Add income
- Add expense
- Register salary
- Register bonus
- Register reimbursements
- View reports
- Export reports

Cannot

- Delete system
- Manage users
- Change system settings

-----------------------------------------

Manager

Permissions

- Dashboard
- Reports
- Profit/Loss
- Employee overview

Read Only

-----------------------------------------

Employee

Permissions

- View own salary
- View bonuses
- View payments
- Download own reports

=========================================
SYSTEM MODULES
=========================================

1. Authentication

OAuth Login

Logout

User Profile

Role Management

Session Management

=========================================

2. Dashboard

Dashboard should display

Today's income

Today's expenses

Monthly income

Monthly expenses

Current profit

Current loss

Employee count

Total salary paid

Pending payments

Tax amount

Latest activities

Recent transactions

=========================================

3. Employees

Employee Information

First Name

Last Name

National ID

Phone

Email

Department

Position

Salary

Employment Date

Status

Notes

=========================================

4. Categories

Expense Categories

Examples

Office

Food

Marketing

Equipment

Transportation

Maintenance

Utilities

Salary

Bonus

Insurance

Tax

Other

Income Categories

Examples

Sales

Services

Investment

Consulting

Other

=========================================

5. Income Management

Each income should include

Title

Category

Description

Amount

Tax

Date

Created By

Attachment (optional)

=========================================

6. Expense Management

Each expense should include

Title

Category

Description

Amount

Tax

Date

Employee

Attachment

Created By

=========================================

7. Salary Management

Employee

Base Salary

Bonus

Overtime

Deduction

Insurance

Tax

Net Salary

Payment Date

Description

=========================================

8. Bonus Management

Employee

Bonus Amount

Reason

Date

Description

=========================================

9. Financial Reports

Generate advanced reports.

Filters

Daily

Weekly

Monthly

Yearly

Custom Date Range

Employee

Department

Category

=========================================
EXCEL EXPORT
=========================================

Every table must support Excel export.

Examples

Income

Expenses

Employees

Salary

Bonuses

Profit & Loss

Tax

Everything

Excel should preserve

Persian headers

Currency formatting

Dates

Totals

=========================================
ADVANCED PDF REPORT
=========================================

Generate a professional Persian PDF Report.

The PDF must be beautiful.

Modern.

Professional.

Company ready.

The report must automatically contain:

Cover Page

Company Name

Report Title

Date

Prepared By

=========================================

Financial Summary

Total Income

Total Expense

Total Profit

Total Loss

Total Tax

Net Profit

=========================================

Employee Summary

Salary Paid

Bonuses

Top Paid Employees

Department Summary

=========================================

Expense Analysis

Largest Expenses

Category Breakdown

Monthly Comparison

=========================================

Income Analysis

Revenue Sources

Monthly Growth

Category Comparison

=========================================

Charts

Include at least 4 charts.

Examples

1.

Monthly Income vs Expenses

2.

Expense Categories Pie Chart

3.

Profit Trend

4.

Department Expense Comparison

Charts must be embedded inside the PDF.

=========================================

PERSIAN ANALYSIS

The PDF should automatically generate professional Persian explanations.

Example

"در این بازه زمانی درآمد شرکت نسبت به ماه گذشته ۱۸ درصد افزایش داشته است."

"بیشترین هزینه مربوط به بخش تجهیزات بوده است."

"سود خالص شرکت برابر با ... ریال می‌باشد."

"هزینه حقوق کارکنان ۳۸٪ از کل هزینه‌ها را تشکیل می‌دهد."

Generate intelligent summaries automatically.

=========================================

SETTINGS

System Settings

Company Name

Company Logo

Default Tax (9%)

Currency

Address

Phone

Email

=========================================

DATABASE DESIGN

Design a normalized MySQL database.

Include

Users

Roles

Permissions

Employees

Income

Expenses

Salary

Bonus

Categories

Settings

Audit Logs

Reports

Attachments

=========================================

AUDIT LOG

Log every action.

User

Action

Date

IP

Affected Record

=========================================

SEARCH

Global Search

Search employees

Search transactions

Search reports

Search expenses

Search income

=========================================

FILTERS

Every table must support

Search

Sorting

Pagination

Date Filter

Category Filter

Employee Filter

=========================================

DASHBOARD CHARTS

Dashboard should display charts

Monthly Revenue

Monthly Expenses

Profit Trend

Salary Distribution

Expense Categories

=========================================

UI

Modern

Responsive

Professional

RTL

Persian

Clean

Minimal

Soft colors

Dark mode support

Light mode support

=========================================

CODE QUALITY

Use clean architecture.

Separate

Routes

Controllers

Services

Middleware

Utilities

Database

Components

Pages

Hooks

Types

Interfaces

Constants

Reusable components

Reusable API functions

=========================================

ERROR HANDLING

Centralized error handling

Validation

Meaningful error messages

=========================================

SECURITY

OAuth Authentication

Role Based Authorization

Input Validation

SQL Injection Protection

Password Encryption (if local authentication is ever added)

Secure APIs

=========================================

API

RESTful APIs

Proper HTTP Status Codes

Consistent JSON responses

=========================================

FINAL DELIVERABLE

Generate the complete project including:

- Full folder structure
- MySQL database schema
- SQL creation scripts
- Backend (Node.js + Express.js + TypeScript)
- Frontend (React + Vite + TypeScript)
- Authentication
- Authorization
- CRUD for every module
- Dashboard
- Charts
- Excel export
- Advanced Persian PDF reporting with at least four charts and intelligent financial analysis
- Audit log
- Settings page
- Professional responsive RTL UI
- Complete API documentation
- README with installation instructions

The project should be production-quality, modular, maintainable, and easily extensible for future features.