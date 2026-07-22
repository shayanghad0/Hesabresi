You are a senior software architect and full-stack engineer.

Build a complete enterprise Financial Management Platform for a company.

## Technology Stack (DO NOT CHANGE)

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
- OAuth Login
- Session/JWT

Language
- Entire UI must be in Persian (Farsi RTL)
- Database, variables, API, and code must remain in English.

The project must be production-ready, scalable, modular, secure, and maintainable.

==================================================
PROJECT PURPOSE
==================================================

This platform is used by a company to manage all financial operations.

It should allow accountants and administrators to manage:

• Income
• Expenses
• Employee salaries
• Bonuses
• Advances
• Company purchases
• Operational costs
• Vendors
• Financial reports
• Profit/Loss analysis
• Excel exports
• Professional PDF reports

Everything must be stored in MySQL.

==================================================
DEFAULT BUSINESS RULE
==================================================

Default Tax/VAT:

9%

Every financial transaction should automatically include a 9% tax unless the accountant disables it for that transaction.

The default is ENABLED.

==================================================
USER ROLES
==================================================

Administrator

Can:

- Manage users
- Manage roles
- View all reports
- Edit everything
- Delete everything
- System settings
- Export reports
- Financial dashboard

--------------------------------------------

Accountant

Can:

- Create expenses
- Create income
- Register salaries
- Register bonuses
- Register purchases
- Register operational costs
- Export reports
- View dashboards

Cannot:

- Manage users
- Change system settings

--------------------------------------------

Viewer

Read-only access.

==================================================
MODULES
==================================================

1. Dashboard

Modern dashboard showing:

Today's income

Today's expenses

Monthly income

Monthly expenses

Current profit

Current loss

Cash Flow

Employee salary total

Bonus total

Tax total

Recent transactions

Charts

==================================================

2. Employees

Employee Information

Name

National ID

Phone

Department

Position

Hire Date

Salary

Status

Notes

==================================================

3. Income

Register income

Fields

Date

Category

Title

Description

Amount

Tax Enabled

Attachments

Created By

==================================================

4. Expenses

Register expense

Examples

Office Supplies

Internet

Electricity

Water

Rent

Maintenance

Marketing

Transportation

Software

Hardware

Food

Travel

Miscellaneous

Each expense contains

Date

Category

Title

Description

Amount

Tax Enabled

Attachment

Created By

==================================================

5. Salary Management

Each employee can have

Monthly Salary

Bonus

Advance

Overtime

Deduction

Insurance

Tax

Net Salary

Payment Status

Payment Date

Notes

==================================================

6. Bonus Management

Bonuses

Reason

Amount

Date

Approved By

==================================================

7. Vendors

Vendor Information

Company

Phone

Address

Description

Payment History

==================================================
REPORTING SYSTEM
==================================================

This is one of the most important parts.

The system must generate TWO report formats.

--------------------------------------------

1) Excel Report

Professional Excel export.

Multiple sheets.

Examples

Income

Expenses

Salary

Bonuses

Taxes

Profit/Loss

Summary

Filters

Date Range

Employee

Department

Category

==================================================

2) Professional PDF Report

Generate a beautiful Persian report.

The PDF should contain:

Company Information

Report Date

Selected Period

Executive Summary

Income Summary

Expense Summary

Profit Summary

Loss Summary

Employee Salary Summary

Bonus Summary

Tax Summary

Financial Analysis

Recommendations

Every section should have Persian explanations.

==================================================
PDF CHARTS
==================================================

Include at least 4 professional charts.

Examples

Monthly Income

Monthly Expenses

Income vs Expense

Profit Trend

Cash Flow

Department Costs

Salary Distribution

Expense Categories

Use modern colorful charts.

==================================================
FINANCIAL ANALYSIS
==================================================

The PDF must automatically analyze data.

Examples

Total income

Total expenses

Net profit

Net loss

Highest expense category

Highest income category

Most expensive department

Employee payment statistics

Tax collected

Average monthly expenses

Average monthly income

Top expenses

Top income sources

Growth comparison

Financial recommendations in Persian

==================================================
SEARCH
==================================================

Global search.

Search by

Employee

Expense

Income

Category

Vendor

Description

==================================================
FILTERS
==================================================

Filter every page by

Date

Category

Employee

Department

Tax Enabled

Created By

==================================================
AUDIT LOG
==================================================

Every action must be logged.

Login

Logout

Create

Update

Delete

Export

User

IP

Timestamp

==================================================
NOTIFICATIONS
==================================================

Show success and error notifications.

==================================================
FILE UPLOAD
==================================================

Allow uploading

Invoice

Receipt

PDF

Image

Document

Store files securely.

==================================================
DASHBOARD CHARTS
==================================================

Interactive charts.

Monthly Income

Monthly Expense

Profit

Salary

Bonuses

Taxes

==================================================
DATABASE
==================================================

Design a fully normalized MySQL database.

Include

Primary Keys

Foreign Keys

Indexes

Relations

Cascade Rules

==================================================
API
==================================================

REST API

Use

Controllers

Services

Repositories

Validation

Authentication

Authorization

Error Handling

Pagination

Filtering

Sorting

Searching

==================================================
SECURITY
==================================================

OAuth Authentication

JWT

Role Based Access Control

Password Hashing

Helmet

Rate Limiting

CORS

SQL Injection Protection

XSS Protection

CSRF Protection

Input Validation

==================================================
PROJECT STRUCTURE
==================================================

Create a clean enterprise architecture.

Backend

src/

controllers

services

repositories

routes

middlewares

models

validators

config

utils

types

database

reports

excel

pdf

charts

uploads

logs

Frontend

src/

pages

components

layouts

hooks

services

api

store

utils

types

assets

styles

==================================================
UI
==================================================

Modern Admin Panel

Responsive

RTL

Dark Mode

Light Mode

Professional Persian Typography

Beautiful Cards

Tables

Charts

Statistics

Animations

==================================================
OUTPUT REQUIREMENTS
==================================================

Generate the complete project step by step.

Include:

1. Folder Structure

2. Database Schema

3. MySQL Tables

4. API Design

5. Backend Architecture

6. Frontend Architecture

7. Authentication

8. Report Engine

9. Excel Export Engine

10. PDF Report Engine

11. Chart Generation

12. Dashboard

13. Employee Management

14. Salary Module

15. Income Module

16. Expense Module

17. Vendor Module

18. Audit Logs

19. Security

20. Production Configuration

21. Docker Support

22. Environment Variables

23. README

24. Installation Guide

25. Deployment Guide

The code should follow enterprise-level best practices, SOLID principles, clean architecture, reusable components, and be easily extensible for future financial features.