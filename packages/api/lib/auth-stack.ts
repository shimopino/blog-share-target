import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export interface AuthStackProps extends cdk.StackProps {
	readonly stage: string;
	readonly googleClientId: string;
	readonly googleClientSecret: string;
	readonly frontendUrls: string[];
}

export class AuthStack extends cdk.Stack {
	public readonly userPool: cognito.UserPool;
	public readonly userPoolClient: cognito.UserPoolClient;
	public readonly identityPool: cognito.CfnIdentityPool;
	public readonly userPoolDomain: cognito.UserPoolDomain;

	constructor(scope: Construct, id: string, props: AuthStackProps) {
		super(scope, id, props);

		// Cognito User Pool
		this.userPool = new cognito.UserPool(this, "BlogShareUserPool", {
			userPoolName: `blog-share-user-pool-${props.stage}`,
			selfSignUpEnabled: true,
			signInAliases: {
				email: true,
			},
			autoVerify: {
				email: true,
			},
			standardAttributes: {
				email: {
					required: true,
					mutable: true,
				},
				givenName: {
					required: true,
					mutable: true,
				},
				familyName: {
					required: true,
					mutable: true,
				},
			},
			passwordPolicy: {
				minLength: 8,
				requireLowercase: true,
				requireUppercase: true,
				requireDigits: true,
				requireSymbols: true,
			},
			accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
		});

		// Add Cognito Domain
		this.userPoolDomain = this.userPool.addDomain("BlogShareDomain", {
			cognitoDomain: {
				domainPrefix: `blog-share-${props.stage}`, // この値は一意である必要があります
			},
		});

		// Google Identity Provider
		const googleProvider = new cognito.UserPoolIdentityProviderGoogle(
			this,
			"GoogleProvider",
			{
				userPool: this.userPool,
				clientId: props.googleClientId,
				clientSecret: props.googleClientSecret,
				scopes: ["profile", "email", "openid"],
				attributeMapping: {
					email: cognito.ProviderAttribute.GOOGLE_EMAIL,
					givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
					familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
					profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
				},
			},
		);

		// Add dependency to ensure Google Provider is created first
		this.userPool.registerIdentityProvider(googleProvider);

		// User Pool Client
		this.userPoolClient = new cognito.UserPoolClient(
			this,
			"BlogShareUserPoolClient",
			{
				userPool: this.userPool,
				oAuth: {
					flows: {
						authorizationCodeGrant: true,
					},
					scopes: [
						cognito.OAuthScope.EMAIL,
						cognito.OAuthScope.OPENID,
						cognito.OAuthScope.PROFILE,
					],
					callbackUrls: props.frontendUrls,
					logoutUrls: props.frontendUrls,
				},
				supportedIdentityProviders: [
					cognito.UserPoolClientIdentityProvider.GOOGLE,
				],
			},
		);

		// Add dependency to ensure User Pool Client is created after Google Provider
		this.userPoolClient.node.addDependency(googleProvider);

		// Identity Pool
		this.identityPool = new cognito.CfnIdentityPool(
			this,
			"BlogShareIdentityPool",
			{
				identityPoolName: `blog-share-identity-pool-${props.stage}`,
				allowUnauthenticatedIdentities: false,
				cognitoIdentityProviders: [
					{
						clientId: this.userPoolClient.userPoolClientId,
						providerName: this.userPool.userPoolProviderName,
					},
				],
			},
		);

		// IAM Roles
		const authenticatedRole = new iam.Role(this, "CognitoAuthenticatedRole", {
			assumedBy: new iam.FederatedPrincipal(
				"cognito-identity.amazonaws.com",
				{
					StringEquals: {
						"cognito-identity.amazonaws.com:aud": this.identityPool.ref,
					},
					"ForAnyValue:StringLike": {
						"cognito-identity.amazonaws.com:amr": "authenticated",
					},
				},
				"sts:AssumeRoleWithWebIdentity",
			),
		});

		// Attach role to identity pool
		new cognito.CfnIdentityPoolRoleAttachment(
			this,
			"IdentityPoolRoleAttachment",
			{
				identityPoolId: this.identityPool.ref,
				roles: {
					authenticated: authenticatedRole.roleArn,
				},
			},
		);

		// Outputs
		new cdk.CfnOutput(this, "UserPoolId", {
			value: this.userPool.userPoolId,
		});

		new cdk.CfnOutput(this, "UserPoolClientId", {
			value: this.userPoolClient.userPoolClientId,
		});

		new cdk.CfnOutput(this, "IdentityPoolId", {
			value: this.identityPool.ref,
		});

		// Add domain URL to outputs
		new cdk.CfnOutput(this, "UserPoolDomainUrl", {
			value: this.userPoolDomain.baseUrl(),
		});
	}
}
