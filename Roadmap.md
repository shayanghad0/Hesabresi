# Project Overview

Build a modern, enterprise-grade Financial Management Platform for a company. The application will be used internally by accountants, finance managers, HR, and administrators to manage all company income, expenses, salaries, bonuses, and financial reports.

The application language (UI) must be **Persian (Farsi / RTL)** while the source code, variables, comments, API endpoints, and database schema must be written in English.

This project should be designed with scalability, maintainability, and security in mind.

---

# Tech Stack

Backend
- Node.js (Latest LTS)
- Express.js
- MySQL 8+
- JWT + OAuth Authentication
- Prisma ORM (Preferred)
- REST API
- bcrypt
- Helmet
- CORS
- Rate Limiting
- Winston Logger
- Multer
- ExcelJS
- PDFKit OR Puppeteer (Preferred for professional reports)
- Chart.js

Frontend

- React
- Vite
- TypeScript
- React Router
- Axios
- React Hook Form
- TailwindCSS
- shadcn/ui
- Recharts
- RTL Support
- Persian Fonts (Vazir or IRANSans)

Database

MySQL

Authentication

OAuth
JWT
Refresh Tokens
Role Based Access Control (RBAC)

---

# Supported Languages

UI Language:
Persian (RTL)

Developer Language:
English

Database:
English

API:
English

Source Code:
English

---

# User Roles

1. Super Admin

Full system access

Can manage everything

Can manage settings

Can create admins

Can manage users

Can view reports

Can export reports

Can manage taxes

Can manage permissions

--------------------------

2. Admin

Manage finance

Manage accountants

View reports

Export reports

Approve records

--------------------------

3. Accountant

Create income

Create expenses

Manage salaries

Manage bonuses

Generate reports

Cannot change system settings

--------------------------

4. HR

Manage employees

Manage salaries

Manage bonuses

Cannot access company settings

--------------------------

5. Viewer

Read only

No editing

---

# System Modules

## Authentication

Login

Logout

OAuth

JWT

Forgot Password

Reset Password

Change Password

Profile

Session Management

Role Permissions

Audit Logs

---

# Dashboard

Professional dashboard

Cards:

Total Income

Total Expense

Net Profit

Net Loss

Total Employees

Total Salary

Total Bonuses

Today's Expenses

Monthly Income

Monthly Expense

Pending Payments

Tax Amount

Charts

Monthly Income

Monthly Expense

Profit Trend

Expense Categories

Cash Flow

Salary Distribution

---

# Employee Management

Employee CRUD

Employee Code

National ID

Phone

Email

Department

Position

Hire Date

Status

Salary

Notes

Attachments

---

# Income Management

Create Income

Edit Income

Delete Income

Search

Filters

Income Categories

Income Date

Reference Number

Payment Method

Invoice Upload

Description

---

# Expense Management

Create Expense

Edit Expense

Delete Expense

Expense Categories

Project

Department

Vendor

Invoice

Attachments

Description

---

# Salary Management

Monthly Salary

Overtime

Bonus

Insurance

Tax

Deductions

Net Salary

Payment Status

Payment Date

Salary History

---

# Bonus Management

Bonus

Reward

Gift

Commission

Performance Bonus

Special Bonus

History

---

# Tax System

System Default Tax

9%

Enabled by default

Administrator can:

Enable

Disable

Change Percentage

Tax should automatically calculate on financial transactions where applicable.

Every report must display

Gross Amount

Tax Amount

Net Amount

---

# Categories

Expense Categories

Income Categories

Projects

Departments

Payment Methods

Currencies

Tags

Fully customizable

---

# Financial Calculations

System must automatically calculate

Total Income

Total Expenses

Gross Profit

Gross Loss

Tax

Net Profit

Net Loss

Employee Costs

Department Costs

Project Costs

Monthly Comparison

Yearly Comparison

Custom Date Range

---

# Reports

This is one of the most important modules.

The system must generate two professional report formats.

----------------------------------------

1. Excel Export

Generate professional Excel files.

Include:

Income

Expenses

Bonuses

Salaries

Taxes

Projects

Departments

Employee Costs

Profit

Loss

Summary Sheet

Totals

Automatic formatting

Professional tables

Filters

Company logo

Persian headers

RTL support

----------------------------------------

2. Professional PDF Report

Generate a beautiful, executive-quality PDF report in Persian.

The PDF should not be a simple table.

It must look like a report prepared by a financial consultant.

Include:

Company Information

Report Title

Date

Prepared By

Executive Summary

Financial Summary

Income Summary

Expense Summary

Salary Summary

Bonus Summary

Tax Summary

Net Profit

Net Loss

Department Analysis

Project Analysis

Top Expenses

Top Income Sources

Employee Cost Analysis

Recommendations

Management Notes

Footer

Page Numbers

Professional Cover Page

Company Logo

Persian Typography

RTL Layout

Professional Colors

Icons

Modern Design

At least 4 professional charts.

Examples:

Monthly Income Chart

Monthly Expense Chart

Profit vs Expense

Department Cost Distribution

Cash Flow

Salary Distribution

Project Cost Distribution

Tax Breakdown

The PDF must be presentation quality.

---

# Search

Global Search

Filters

Date Range

Employee

Project

Department

Expense Type

Income Type

Status

---

# Notifications

Salary Reminder

Expense Approval

Monthly Report Ready

System Alerts

Email Notifications

---

# Audit Logs

Every important action should be logged.

Login

Logout

Create

Update

Delete

Export

Permission Changes

Settings Changes

---

# Settings

Company Name

Company Logo

Address

Phone

Email

Website

Tax Percentage

Currency

Timezone

Language

Theme

Dark Mode

Light Mode

---

# Security

Helmet

Rate Limiting

CSRF Protection

Input Validation

SQL Injection Protection

XSS Protection

Parameterized Queries

Secure Cookies

Refresh Tokens

Password Hashing

Audit Logs

---

# API

RESTful API

Proper Status Codes

Pagination

Filtering

Sorting

Search

Validation

Swagger Documentation

---

# UI Requirements

Modern

Minimal

Fast

Responsive

RTL

Persian

Professional

Dark Mode

Light Mode

Large Data Tables

Sticky Headers

Sidebar Navigation

Breadcrumbs

Loading Skeletons

Toast Notifications

Confirmation Dialogs

Keyboard Shortcuts

---

# Future Ready

The architecture must allow future modules without major refactoring.

Examples:

Inventory

Warehouse

CRM

Accounting

Bank Accounts

Checks

Invoices

Purchase Orders

Sales Orders

Assets

Loans

Multi Company

Multi Branch

Multi Currency

API Integration

SMS Gateway

Payment Gateway

Accounting Integration

---

# Coding Standards

Use clean architecture.

Separate Controllers, Services, Repositories, Middleware, Models, Routes, Validators, Utilities, and Config.

Avoid duplicated code.

Follow SOLID principles.

Use reusable components.

Write readable code.

Write documentation.

Add comments only where necessary.

Use TypeScript where possible.

Implement proper error handling.

Return standardized API responses.

Create database migrations and seeders.

Use environment variables.

Design the project so it can support hundreds of thousands of financial records efficiently.

The final product should feel like a commercial ERP/Financial Management System rather than a simple CRUD application.
