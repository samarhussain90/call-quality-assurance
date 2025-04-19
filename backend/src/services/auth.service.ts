import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Organization } from "../entities/Organization";

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);
    private organizationRepository = AppDataSource.getRepository(Organization);

    async registerUser(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        organizationName: string;
    }) {
        // Check if user exists
        const existingUser = await this.userRepository.findOne({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        // Create organization
        const organization = this.organizationRepository.create({
            name: data.organizationName,
            slug: data.organizationName.toLowerCase().replace(/\s+/g, "-"),
            is_active: true
        });

        await this.organizationRepository.save(organization);

        // Hash password
        const passwordHash = await hash(data.password, 10);

        // Create user
        const user = this.userRepository.create({
            email: data.email,
            password_hash: passwordHash,
            first_name: data.firstName,
            last_name: data.lastName,
            role: "admin",
            organization_id: organization.id,
            is_active: true
        });

        await this.userRepository.save(user);

        // Generate JWT
        const token = this.generateToken(user);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            },
            organization: {
                id: organization.id,
                name: organization.name,
                slug: organization.slug
            },
            token
        };
    }

    async loginUser(email: string, password: string) {
        // Find user
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ["organization"]
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        // Verify password
        const isValidPassword = await compare(password, user.password_hash);

        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }

        // Generate JWT
        const token = this.generateToken(user);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            },
            organization: {
                id: user.organization.id,
                name: user.organization.name,
                slug: user.organization.slug
            },
            token
        };
    }

    private generateToken(user: User) {
        return sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                organizationId: user.organization_id
            },
            process.env.JWT_SECRET || "your-super-secret-jwt-key",
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d"
            }
        );
    }

    verifyToken(token: string) {
        try {
            return verify(token, process.env.JWT_SECRET || "your-super-secret-jwt-key");
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
} 