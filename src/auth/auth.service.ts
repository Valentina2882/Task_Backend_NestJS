import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { DbErrorCodes } from './helpers/auth.constants';
import { getAccessToken, getSaltAndHashPassword } from './helpers/auth.methods';

@Injectable()
export class AuthService {
  // adding logger
  private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Injection of the User repository into the service
    private readonly jwtService: JwtService
  ) {}
  
  /**
   * @description
   * this service method takes the users sign up credentials as input parameter,
   * hashes the plaintext password of the user with a unique salt
   * and then saves the user in the database
   * @param {AuthCredentialsDto} authCredentialsDto user's signup credentials
   * @returns
   */
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    try {
      const { salt, hashPassword } = await getSaltAndHashPassword(password);
      const newUser = this.userRepository.create({
        username,
        password: hashPassword,
        salt,
      });
      await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === DbErrorCodes.DuplicateKey) { // violation of the unique constraint of the 'username' column
        throw new ConflictException('Username already exists');
      } else {
        throw error;
      }
    }
  }

  /**
   * @description
   * this service method takes the user's sign in credentials as input parameter
   * and the checks the authenticity of the credentials
   * if auth check is successful, an access token is generated for the user
   * @param {AuthCredentialsDto} authCredentialsDto user's signup credentials
   * @returns the jwt access token
   */
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    try {
      const user = await this.userRepository.findOneBy({ username });

      if (!user || !await user.validatePassword(password)) throw new UnauthorizedException('Invalid credentials');

      const accessToken: string = await getAccessToken(username, this.jwtService);

      return { accessToken };
    } catch (error) {
      this.logger.error(`Error while a user trying to log in`, error.stack);

      if (error?.response?.statusCode === 401) throw new UnauthorizedException(error?.message);
      throw new InternalServerErrorException();
    }
  }
}
