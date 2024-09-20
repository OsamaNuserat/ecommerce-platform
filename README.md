## E-commerce Platform

### Overview
This project is an e-commerce platform built with Node.js. It provides a robust backend service for managing products, users, orders. The platform integrates with Cloudinary for image storage and management, ensuring high performance and scalability.

### Features
- **User Authentication**: Secure user registration and login using JWT.
- **Product Management**: CRUD operations for products.
- **Order Management**: Create and manage customer orders.
- **Image Management**: Integration with Cloudinary for image uploads and storage.
- **Environment Configuration**: Uses dotenv for managing environment variables.

### Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **Cloudinary**: Cloud-based image and video management.
- **JWT**: JSON Web Tokens for authentication.
- **dotenv**: Environment variable management.

### Getting Started
1. **Clone the repository**:
    ```bash
    git clone https://github.com/OsamaNuserat/ecommerce-platform.git
    cd ecommerce-platform
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```
    API_KEY = your_api_key
    API_SECRET = your_api_secret
    NODE_ENV = your_node_dev
    PORT = 3000
    SALT_ROUND = 8
    MY_DB = "mongodb+srv://your_username:your_password@cluster0.t10quvk.mongodb.net/ecommerce"
    SIGNATURE = "your_signature"
    BEARER_KEY = "your_bearer_key"
    EXPIRES_IN = "1h"
    EMAIL = "your_email@example.com"
    APP_PASSWORD = "your_app_password"
    CONFIRM_SIGNATURE = "your_confirmation_signature"
    CLOUD_NAME = "your_cloud_name"
    ```

4. **Run the application**:
    ```bash
    npm run dev
    ```

### Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

### License
This project is licensed under the MIT License.
