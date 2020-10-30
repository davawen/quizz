export function redirect(href: string)
{
	window.location.replace(href);
}

/**
 * Request the main server and use the callback when a response arrives
 */
export function request(method: ('GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'), url: string, body: string | null, callback: (response: string) => void): XMLHttpRequest
{
	let req = new XMLHttpRequest();
	
	req.open(method, url);
	
	if(body !== null)
	{
		req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		req.send(body);
	}
	else
	{
		req.send();
	}
	
	req.addEventListener('load', function(){ callback(this.responseText) });
	
	return req;
}

type Selector = ("#" | "." | "");

type SelectorType<T> = 
	T extends "#" ? HTMLElement :
	T extends "." ? HTMLCollectionOf<Element> :
	T extends "" ? HTMLCollectionOf<Element> :
	never;

export function $<T extends Selector>(selector: T, elementName: string): SelectorType<T>
{
	let returnValue: any;
	switch(selector)
	{
		case '.':
			returnValue = document.getElementsByClassName(elementName);
			break;
		case '#':
			returnValue = document.getElementById(elementName);
			break;
		default:
			returnValue = document.getElementsByTagName(elementName);
			break;
	}
	
	return returnValue;
}