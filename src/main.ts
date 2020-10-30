import { Client, Expr, query } from 'faunadb';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { PathParams } from 'express-serve-static-core';
import fs from 'fs';

config();

const PORT = 8080 || process.env.PORT;

const { Collection, Index, Match, Get, Ref, Paginate, Create, Login, Logout } = query;

const client = new Client({ secret: process.env.FAUNA_SECRET } );

const _public = __dirname + '/public';

//#region Setup

const app = express();

app.use(
	session(
		{
			secret: 'secret',
			resave: true,
			saveUninitialized: true
		}
	)
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//#endregion

//#region Classes

//#endregion

//#region Interfaces

interface User
{
	ref: Expr;
	ts: number;
	data: 
	{
		username: string;
		password: string;
	}
}

interface PaginateUsers
{
	data: User['ref'][]
}

interface LoginInformation
{
	ref: Expr;
	ts: number;
	instance: Expr;
	secret: string;
}

interface Req extends express.Request
{
	session: 
	{
		regenerate: (callback: (err: any) => void) => void; //Have to do whatever this shit is to extend the property
		destroy: (callback: (err: any) => void) => void;
		reload: (callback: (err: any) => void) => void;
		save: (callback: (err: any) => void) => void;
		touch: () => void;
		id: string;
		cookie: Express.SessionCookie;
		loggedIn: boolean;
		username: string;
		credentials: LoginInformation;
	}
}

//#endregion

//#region File requests

app.use(express.static(_public));

//#endregion

app.post('/createauth',
	async (req: Req, res) =>
	{
		let username: string = req.body.username;
		let password: string = req.body.password;
		
		console.log(username + '.' + password);
		
		if(username && password)
		{
			//See if user already exists
			
			const docs: PaginateUsers = await client.query(
				Paginate(Match(Index("usersByUsername"), username))
			);
			
			console.log(docs);
			
			if(docs.data.length > 0)
			{
				res.send('409');
				res.end();
				return;
			}
			
			//Create account then login
			await client.query(
				Create(Collection('users'),
					{
						data:
						{
							username: username
						},
						credentials:
						{
							password: password
						}
					}
				)
			);
			
			const credentials: LoginInformation = await client.query(
				Login(
					Match(Index("usersByUsername"), username),
					{ password: password }
				)
			);
			
			req.session.loggedIn = true;
			req.session.username = username;
			req.session.credentials = credentials;
			
			console.log(req.session);
			
			res.send('200');
		}
		else
		{
			res.send('400');
		}
		
		res.end();
	}
);

app.post('/auth',
	async (req: Req, res) => // 
	{
		let username: string = req.body.username;
		let password: string = req.body.password;
		
		if(username && password)
		{
			//const docs: PaginateUsers = await client.query(
			//	Paginate(, password))
			//);
			
			try
			{
				const credentials: LoginInformation = await client.query(
					Login(
						Match(Index("usersByUsername"), username),
						{ password: password }
					)
				);
				
				req.session.loggedIn = true;
				req.session.username = username;
				req.session.credentials = credentials;
				
				res.send('200');
			}
			catch(e)
			{
				res.send('401');
			}
		}
		else
		{
			res.send('400');
		}
		
		res.end();
	}
);

app.get('/confirmauth',
	(req, res) =>
	{
		res.send(req.session.loggedIn);
		res.end();
	}
);

//app.get('/quizz',
//	(req, res) =>
//	{
//		const quizzs = client.query(
			
//		)
//	}
//);

app.get('/logout',
	(req, res) =>
	{
		client.query(Logout(false));
		
		req.session.destroy( () => {} );
		res.redirect('/');
	}
);

app.listen(PORT, () => console.log("Server started!"));