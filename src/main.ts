import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserService } from './user/user.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT || 9000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('kodx')
    .addTag('Nestjs,prisma,postgresql,swagger,nodejs')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const userService = app.get(UserService);

  const admin = await userService.getByPhone('+998990223343');
  if (!admin) {
    await userService.create(
      {
        username: 'admin',
        phone: '+998990223343',
        password: 'admin',
      },
      'admin',
    );
    console.log('admin created');
  } else {
    console.log('There is already admin');
  }

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, 
    }),
  );

  await app.listen(PORT);
}
bootstrap();
