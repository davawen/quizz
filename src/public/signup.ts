import { redirect, request, $ } from './global.js'

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
		
		let req = request('POST', '/createauth', body,
			(res) =>
			{
				switch(res)
				{
					case '200':
						redirect('/home.html');
						break;
					case '409':
						$('.', 'error')[0].textContent = 'Cette utilisateur existe déjà.';
						break;
					default:
						$('.', 'error')[0].textContent = 'Erreur non attendue.';
						break;
				}
			}
		);
		
		req.onload = console.log;
	}
);

