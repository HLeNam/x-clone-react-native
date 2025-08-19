import mongoose from 'mongoose';
import { ENV } from '~/config/env';

class Database {
  private static instance: Database;
  private isConnected: boolean = false;
  private connectionRetries: number = 0;
  private readonly maxRetries: number = 5;

  constructor() {
    this.setupConnectionEvents();
  }

  private setupConnectionEvents() {
    // Connection successful
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
      this.isConnected = true;
      this.connectionRetries = 0;
    });

    // Connection error
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
    });

    // Connection disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      this.isConnected = false;

      // Auto reconnect in production
      if (ENV.NODE_ENV === 'production' && this.connectionRetries < this.maxRetries) {
        this.connectionRetries++;
        console.log(`🔄 Attempting to reconnect... (${this.connectionRetries}/${this.maxRetries})`);
        setTimeout(() => this.connect(), 5000);
      }
    });

    // Process termination
    process.on('SIGINT', this.gracefulShutdown);
    process.on('SIGTERM', this.gracefulShutdown);
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('📡 MongoDB already connected');
      return;
    }

    // Enable debug mode in development
    if (ENV.NODE_ENV === 'development') {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    try {
      const connectionOptions = {
        maxPoolSize: 10, // Connection pool
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false // Disable mongoose buffering
      };

      await mongoose.connect(ENV.MONGO_URI, connectionOptions);
    } catch (error) {
      console.error('🚀 ~ Database ~ connect ~ error:', error);

      // Retry connection in development
      if (ENV.NODE_ENV === 'development') {
        console.log('🔄 Retrying connection in 5 seconds...');
        setTimeout(() => this.connect(), 5000);
      } else {
        process.exit(1); // Exit in production if can't connect
      }
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      // console.log('📴 MongoDB disconnected gracefully');
    } catch (error) {
      console.error('Error during MongoDB disconnection:', error);
    }
  }

  private gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    await this.disconnect();
    process.exit(0);
  };

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Singleton instance
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Initialize connection
  static async initialize(): Promise<void> {
    const instance = Database.getInstance();
    await instance.connect();
  }
}

export default Database;
