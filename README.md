Flashm (Flash Middleware) - Making Almost Server Less Apex Calls
-------------

<div align="center">
  <img alt="Flashm (Flash Middleware)"
       src="https://raw.githubusercontent.com/TheVishnuKumar/Flashm/master/flashm%20logo.png">
</div>
<br/>
<a href="https://githubsfdeploy.herokuapp.com?owner=TheVishnuKumar&repo=Flashm">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

Blog: <a href="http://www.0to1code.com/flashm-making-almost-server-less-apex-calls-from-lightning-web-component/">http://www.0to1code.com/flashm-making-almost-server-less-apex-calls-from-lightning-web-component/</a> 

About
-------------
Flashm is a Lightning Web Component framework to reduce Apex server calls and enhance the performance of data fetching for Lightning Web Components. The framework stores the promises at the browser's tab and it can be reused without making the almost no server call.

Flashm works great when we need to retrieve the same data in a low network or no network.

Use Case
-------------
Assume that we are loading configuration data from sObject/Custom Settings. We want to use this data on various place like Utility Bar, Multiple pages throughout the app. We are having 5 to 6 Lightning Web Components on the page. These can be in the hierarchy, Utility Bar and individually placed on the page. 
All of these are using basic configuration and making server calls for the same data.
After using Flashm, this data will be loaded for only one time and can be used across all pages.

In my case, I was having 6-7  Lightning Web Components on the page and 4 LWCs in the utility bar with having 6 lightning page tabs. If I don't use Flashm then it would cost me 60 Apex Server Calls and these get increased as the user navigates to the App many times. It can go from 10 to 100 easily. After using Flashm, It is only and only <b>One</b>.

How it Works and Why is Super Fast?
-------------
Flashm works as middleware between Lightning Web Component and Apex Calls. It provides the memory to store the blocks and cells. You invoke Flashm then Flashm invokes the Apex call. Flashm is based on Blocks and Cells.

<b>Block:</b> is the address that is same for all the same Apex methods. A block contains multiple cells.

<b>Cell:</b> Cell is the place where the parameters and promises get stored. Cells provide virtual memory. Parameters work as a unique address for every cell in the block.

<div align="center">
  <img alt="Flashm"
       src="https://raw.githubusercontent.com/TheVishnuKumar/Flashm/master/Flashm%20Process.jpg">
</div>

As described in the diagram, Because every apex call is first checked in the Flashm memory. If a promise is found in the Flashm memory then it returns from the here instead of going to the server.

Features
-------------
- Superfast as it uses the Flashm memory to store the promises and return data if needed instead of making the server call.
- You have control to erase the cell, block, and entire Flashm memory.
- If Flashm memory contains data and apex call is requested then it can be used without network as well. Ex: Can be used at Kiosks where the app has limited searches and no network sometimes.
- Reduce the Server load. Provide more lighting to your lightning app.

Methods
----------
 Using Flashm is very simple as you don't need to get worried when the promises get resolved and syntaxes are very simple. Flashm has four methods.

1. **invoke**: This method is the entry point to Flashm and calls the Apex methods. It has 4 parameters.<br/>
<b>A: Block Address:</b> Don't use the same name for two different kinds of Apex methods. Ex: Don't use getAccount as block address for getAccount() and getContact() apex methods. As it will store promise of first called method and then return this one only.<br/>
<b>B: Apex Method:</b> The name of the apex method which is imported.<br/>
<b>C: Parameters:</b> (Optional) Pass the parameters as you want in @AuraEnabled method.<br/>
<b>D: Force Refresh:</b> (Optional) Accept a boolean value. Default is false. If passed true then it always makes the server call instead of checking from the Flashm memory.<br/>

```javascript
//Importing apex method
import getContacts from '@salesforce/apex/ContactSearchController.getContacts';

//Invoking the Flashm
flashm.invoke( 'getUserFullInformation' , getContacts, {name: searchStr}, true )
.then( (data) =>{
    this.contacts = data;
}).
catch( (error) =>{
    //In case of failure remove failed promise
    flashm.flushCell( 'getUserFullInformation' , {name: searchStr} );
    console.log('Error: '+JSON.stringify(error) );
});
```

2. **flushCell**: This method removes the cell. Now, the next call will go to Server and stores the latest promise into the memory. It has 2 parameters.<br/>
A: Block Address<br/>
B: Parameter: (Optional)<br/>

```javascript
flashm.flushCell( 'getUserFullInformation' , {name: searchStr} );
```

3. **flushBlock**: This method removes the block and all the cells inside the block. It takes one parameter as the block address.

```javascript
flashm.flushBlock( 'getUserFullInformation' );
```

4. **flushAll**: This method cleans out all the Flashm memory.
```javascript
flashm.flushAll();
```

Considerations and Limitation
-------------
- Don't use when dealing with large data.
- Don't use to commit/DML to the server. Must be used to retrieve the data from the server.
- Take care while naming the Block address. Don't use the same name for two different kinds of Apex methods.
- Should use flushCell in catch statements. So in case of error, Flashm doesn't store the error. In the next call, it tries a server call to retrieve success result.
- Should not be used with cacheable methods.

Demo & Code
-------------
Demo: <a href="https://www.youtube.com/watch?v=rLQOW6NrbL8">Youtube</a><br/>
Gist: <a href="https://gist.github.com/TheVishnuKumar/176504b9a6d41c671d2d348523a006de">Gist</a>

Release
-------------
v1.0: Initial Release
