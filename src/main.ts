import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  // Config cookie
  app.use(cookieParser());

  const reflector:Reflector = new Reflector();
    // Config env
  const configService = app.get(ConfigService);
    // Config Validation
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));

  // Config static file
  app.useStaticAssets(join(__dirname, '..', '/src/public'));
  app.setBaseViewsDir(join(__dirname, '..', '/src/views'));
  app.setViewEngine('ejs');

  // Config CORS
  app.enableCors({
  "origin": true,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  credentials: true
  });
  // Config Interceptor trả về res dạng chuẩn
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // Config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1','2'],
  });

  //config helmet
  app.use(helmet());

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('FULL API IT VIEC')
    .setDescription('Here is the all APIs of this web')
    .setVersion('1.0')
    .addBearerAuth(
          {
            type: 'http',
            scheme: 'Bearer',
            bearerFormat: 'JWT',
            in: 'header',
          },
          'token',
        )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
