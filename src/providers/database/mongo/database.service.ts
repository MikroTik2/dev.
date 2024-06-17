import { MongooseOptionsFactory, MongooseModuleOptions } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseConfig } from "@/config/database.config";
import { AppConfig } from "@/config/app.config";

import * as mongoose from 'mongoose';

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
     private readonly config: DatabaseConfig;
     private readonly host: string;
     private readonly database: string;
     private readonly user: string;
     private readonly password: string;
     private readonly srv: boolean;
     private readonly admin: boolean;
     private readonly ssl: boolean;
     private readonly debug: boolean;
     private readonly options: string;
     private readonly env: string;   

     constructor(private readonly configService: ConfigService) {
          this.config = this.configService.get<DatabaseConfig>('database');
          this.env = this.configService.get<AppConfig>('app').env;
          this.host = this.config.host;
          this.database = this.config.name;
          this.user = this.config.user;
          this.password = this.config.password;
          this.srv = this.config.srv;
          this.admin = this.config.admin;
          this.ssl = this.config.ssl;
          this.debug = this.config.debug;
          this.options = this.config.options ? `?${this.config.options}` : '';
     };

     createMongooseOptions(): MongooseModuleOptions {
          let uri = '';
          
          if (this.env === 'production') {
               uri = `mongodb+srv://${this.user}:${this.password}@${this.host}/${this.database}`;
          } else if (this.env === 'development') {
               uri = `mongodb://127.0.0.1:27017/${this.database}`;
          };

          if (this.options) {
               uri += `?${this.options}`;
          };
          
          if (this.env !== 'production' && this.env !== 'development') {
               mongoose.set('debug', this.debug);
          };
     
          const mongooseOptions: MongooseModuleOptions = {
               uri,
          };
     
          if (this.admin) {
               mongooseOptions.authSource = 'admin';
          };

          if (this.env !== 'production' && this.env !== 'development') {
               if (this.user && this.password) {
                    mongooseOptions.auth = {
                         username: this.user,
                         password: this.password,
                    };
               };
          };
     
          if (this.ssl) {
               mongooseOptions.ssl = true;
          };
     
          return mongooseOptions;
     };
};