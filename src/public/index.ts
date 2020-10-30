import { redirect, request, $ } from './global.js';

//Check if connected on start 
request('GET', '/confirmauth', null,
	(res) =>
	{
		if(res)
		{
			redirect('/home.html');
		}
	}
);

//Fetch login data when button is pressed
$('#', 'submit').addEventListener('click', 
	() =>
	{
		let username = (<HTMLInputElement>$('#', 'username')).value;
		let password = (<HTMLInputElement>$('#', 'password')).value;
		
		if(!(username && password)) return;
		
		const body = JSON.stringify(
			{
				username: username,
				password: password
			}
		);
		
		request('POST', '/auth', body,
			(res) =>
			{
				switch(res)
				{
					case '200':
						redirect('/home.html');
						break;
					case '401':
						$('.', 'error')[0].textContent = 'Identifiant ou mot de passe faux.';
						break;
					default:
						$('.', 'error')[0].textContent = 'Erreur non attendue.';
						break;
				}
			}
		);
	}
);