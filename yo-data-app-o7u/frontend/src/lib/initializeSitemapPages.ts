import type { backendInterface, SitemapPage } from '../backend';

const defaultSitemapPages: Omit<SitemapPage, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'about',
    route: '/about',
    title: 'About',
    metadata: 'Learn about YO-Data platform',
    navOrder: BigInt(1),
    visibility: true,
    version: BigInt(1),
    content: `# About YO-Data

YO-Data is a comprehensive data management and analytics platform built on the Internet Computer.

## Our Mission

We provide a unified interface for data operations with support for various data formats and integration capabilities.

## Key Features

* **Data Ingestion**: Import from multiple sources
* **Data Processing**: Clean and transform data
* **Data Visualization**: Create charts and dashboards
* **Collaboration**: Share datasets with team members

## Technology

Built with cutting-edge technology on the Internet Computer blockchain for security and scalability.`,
  },
  {
    id: 'blog',
    route: '/blog',
    title: 'Blog',
    metadata: 'Latest news and updates',
    navOrder: BigInt(2),
    visibility: true,
    version: BigInt(1),
    content: `# YO-Data Blog

Stay updated with the latest news, features, and insights from the YO-Data platform.

## Recent Posts

### Welcome to YO-Data
*Published: 2025*

We're excited to introduce YO-Data, a comprehensive data management platform built on the Internet Computer.

### Getting Started Guide
*Coming Soon*

Learn how to make the most of YO-Data's powerful features.`,
  },
  {
    id: 'faq',
    route: '/faq',
    title: 'FAQ',
    metadata: 'Frequently asked questions',
    navOrder: BigInt(3),
    visibility: true,
    version: BigInt(1),
    content: `# Frequently Asked Questions

## General Questions

### What is YO-Data?
YO-Data is a comprehensive data management and analytics platform that enables users to ingest, process, query, and visualize data from multiple sources.

### How do I get started?
Simply log in with Internet Identity and start uploading your datasets.

### Is my data secure?
Yes, all data is stored securely on the Internet Computer blockchain with encryption at rest and in transit.

## Technical Questions

### What file formats are supported?
We support CSV, JSON, Excel, and other structured data formats.

### Can I share datasets with my team?
Yes, you can share datasets with specific users and control their access permissions.`,
  },
  {
    id: 'features',
    route: '/features',
    title: 'Features',
    metadata: 'Explore platform features',
    navOrder: BigInt(4),
    visibility: true,
    version: BigInt(1),
    content: `# Platform Features

## Data Management

* **Multi-Source Ingestion**: Import from CSV, JSON, APIs, and databases
* **Data Processing**: Clean, transform, and normalize your data
* **Version Control**: Track changes and maintain data history

## Analytics & Visualization

* **Query Builder**: Visual interface for data queries
* **SQL Support**: Direct SQL query execution
* **Charts & Dashboards**: Create beautiful visualizations

## Collaboration

* **Team Sharing**: Share datasets with team members
* **Access Control**: Granular permission management
* **Project Organization**: Group related datasets

## Security

* **Blockchain Storage**: Secure storage on Internet Computer
* **Encryption**: Data encrypted at rest and in transit
* **Internet Identity**: Secure authentication`,
  },
  {
    id: 'pros',
    route: '/pros',
    title: 'Pros',
    metadata: 'Why choose YO-Data',
    navOrder: BigInt(5),
    visibility: true,
    version: BigInt(1),
    content: `# Why Choose YO-Data?

## Key Advantages

### Decentralized & Secure
Built on the Internet Computer blockchain for maximum security and reliability.

### Easy to Use
Intuitive interface designed for both technical and non-technical users.

### Powerful Analytics
Advanced querying and visualization capabilities for deep insights.

### Scalable
Handle datasets up to 1M rows with sub-second query response times.

### Collaborative
Share datasets and work together with your team seamlessly.

### Cost-Effective
Efficient storage and processing on the Internet Computer.`,
  },
  {
    id: 'referral',
    route: '/referral',
    title: 'Referral',
    metadata: 'Refer friends and earn rewards',
    navOrder: BigInt(6),
    visibility: true,
    version: BigInt(1),
    content: `# Referral Program

## Share YO-Data with Your Network

Help us grow the YO-Data community and earn rewards!

## How It Works

1. **Share**: Invite friends and colleagues to YO-Data
2. **They Join**: When they sign up and start using the platform
3. **You Earn**: Receive rewards for successful referrals

## Benefits

* Help your network discover powerful data management tools
* Build a community of data professionals
* Earn rewards for growing the platform

*Referral program details coming soon!*`,
  },
  {
    id: 'terms',
    route: '/terms',
    title: 'Terms',
    metadata: 'Terms of service',
    navOrder: BigInt(7),
    visibility: true,
    version: BigInt(1),
    content: `# Terms of Service

## Agreement to Terms

By accessing and using YO-Data, you agree to be bound by these Terms of Service.

## Use of Service

* You must be at least 18 years old to use this service
* You are responsible for maintaining the security of your account
* You may not use the service for any illegal purposes

## Data Usage

* You retain all rights to your data
* We do not sell or share your data with third parties
* Data is stored securely on the Internet Computer

## Limitation of Liability

The service is provided "as is" without warranties of any kind.

## Changes to Terms

We reserve the right to modify these terms at any time.

*Last updated: 2025*`,
  },
  {
    id: 'who',
    route: '/who',
    title: 'Who',
    metadata: 'Who we are',
    navOrder: BigInt(8),
    visibility: true,
    version: BigInt(1),
    content: `# Who We Are

## The Team Behind YO-Data

YO-Data is developed by SECOINFI, a technology company focused on building innovative solutions on the Internet Computer.

## Leadership

**DILEEP KUMAR D**  
CEO & Founder of SECOINFI

## Our Vision

We believe in democratizing data management and making powerful analytics tools accessible to everyone.

## Contact Us

Visit our [contact page](/contact) to get in touch with our team.`,
  },
  {
    id: 'what',
    route: '/what',
    title: 'What',
    metadata: 'What we do',
    navOrder: BigInt(9),
    visibility: true,
    version: BigInt(1),
    content: `# What We Do

## Comprehensive Data Management

YO-Data provides a complete solution for managing your data lifecycle.

## Our Services

### Data Ingestion
Import data from multiple sources including files, APIs, and databases.

### Data Processing
Clean, transform, and prepare your data for analysis.

### Data Analytics
Run queries and perform statistical analysis on your datasets.

### Data Visualization
Create charts, graphs, and dashboards to visualize insights.

### Data Collaboration
Share datasets and collaborate with your team.

## Industries We Serve

* Business Analytics
* Research & Academia
* Data Science
* Software Development`,
  },
  {
    id: 'why',
    route: '/why',
    title: 'Why',
    metadata: 'Why YO-Data exists',
    navOrder: BigInt(10),
    visibility: true,
    version: BigInt(1),
    content: `# Why YO-Data?

## The Problem

Traditional data management platforms are often:
* Expensive and complex
* Centralized with security concerns
* Difficult to use for non-technical users
* Limited in collaboration features

## Our Solution

YO-Data addresses these challenges by:

### Decentralization
Built on the Internet Computer for security and reliability.

### Simplicity
Intuitive interface that anyone can use.

### Affordability
Cost-effective pricing with transparent costs.

### Collaboration
Built-in sharing and team features.

## The Future

We're building the future of data management on the blockchain, making it accessible, secure, and collaborative for everyone.`,
  },
];

export async function initializeSitemapPages(actor: backendInterface): Promise<void> {
  try {
    const existingPages = await actor.getSitemapPages();
    
    // Only initialize if no pages exist
    if (existingPages.length === 0) {
      console.log('Initializing default sitemap pages...');
      
      for (const page of defaultSitemapPages) {
        await actor.createSitemapPage(
          page.route,
          page.title,
          page.metadata,
          page.navOrder,
          page.visibility,
          page.content
        );
      }
      
      console.log('Default sitemap pages initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize sitemap pages:', error);
  }
}
