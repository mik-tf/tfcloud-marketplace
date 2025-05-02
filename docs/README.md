# ThreeFold Cloud Marketplace Documentation

This directory contains comprehensive documentation for the ThreeFold Cloud Marketplace project. This README provides an overview of the available documentation and how to use it effectively.

## Documentation Overview

| Document | Description |
|----------|-------------|
| [Setup Guide](SETUP_GUIDE.md) | Comprehensive instructions for setting up and testing the project |
| [Testing Guide](TESTING_GUIDE.md) | Detailed instructions for testing all components of the project |
| [Backend Environment Configuration](backend/ENV_CONFIGURATION.md) | Detailed information about backend environment variables |
| [Frontend Environment Configuration](frontend/ENV_CONFIGURATION.md) | Detailed information about frontend environment variables |
| [Smoke Test](SMOKE_TEST.md) | Instructions for running smoke tests on the project |
| [Project Overview](overview.md) | High-level overview of the project |
| [Development Steps](steps.md) | Modular and evolutive roadmap for the project |

## Getting Started

If you're new to the project, we recommend following these steps:

1. Start with the [Project Overview](overview.md) to understand the high-level architecture and goals of the project.
2. Follow the [Setup Guide](SETUP_GUIDE.md) to set up your development environment.
3. Use the [Testing Guide](TESTING_GUIDE.md) to verify your setup and understand how to test the project.
4. Refer to the environment configuration guides ([Backend](backend/ENV_CONFIGURATION.md) and [Frontend](frontend/ENV_CONFIGURATION.md)) for detailed information about configuring the project.

## Environment Configuration

The project requires several environment variables to be configured for both the backend and frontend components. These variables control authentication, database connections, payment processing, and application settings.

- [Backend Environment Configuration](backend/ENV_CONFIGURATION.md) provides detailed information about which backend environment variables should be changed and which should remain as is.
- [Frontend Environment Configuration](frontend/ENV_CONFIGURATION.md) provides similar information for the frontend environment variables.

## Testing

The project includes comprehensive testing capabilities for both the backend and frontend components.

- [Testing Guide](TESTING_GUIDE.md) provides detailed instructions for running unit tests, integration tests, end-to-end tests, and manual testing procedures.
- [Smoke Test](SMOKE_TEST.md) provides instructions for running quick smoke tests to verify the basic functionality of the project.

## Development

For information about the development process and roadmap, refer to the [Development Steps](steps.md) document.

## Backend Documentation

The backend directory contains additional documentation specific to the backend component:

- [Architecture](backend/ARCHITECTURE.md) - Detailed information about the backend architecture
- [Implementation TODO](backend/IMPLEMENTATION_TODO.md) - Tasks that need to be implemented
- [2-Phase Implementation](backend/2_phase_implementation.md) - Information about the phased implementation approach

## Contributing

When contributing to the documentation, please follow these guidelines:

1. Use Markdown for all documentation files.
2. Include a table of contents for longer documents.
3. Use relative links to reference other documentation files.
4. Keep the documentation up-to-date with code changes.
5. Include examples and code snippets where appropriate.

## Troubleshooting

If you encounter issues with the project, refer to the troubleshooting sections in the [Setup Guide](SETUP_GUIDE.md#troubleshooting) and [Testing Guide](TESTING_GUIDE.md#troubleshooting).

---

This documentation is maintained by the ThreeFold Cloud Marketplace team. If you find any issues or have suggestions for improvement, please create an issue in the project repository.