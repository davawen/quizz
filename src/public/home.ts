import { redirect, request } from './global.js';

request('GET', '/confirmauth', null, 
	(res) =>
	{
		if(!res) redirect('/');
	}
);