Flashm (Flash Middleware) - Making Almost Server Less Apex Calls
-------------

<div align="center">
  <img alt="Flashm (Flash Middleware)"
       src="https://raw.githubusercontent.com/TheVishnuKumar/one-pub-sub-lwc/master/one%20pub%20sub.png">
</div>
<br/>
<a href="https://githubsfdeploy.herokuapp.com?owner=TheVishnuKumar&repo=Flashm">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

<!-- Blog: <a href="http://www.0to1code.com/one-pubsub-a-pubsub-library-for-lightning-web-component-and-aura-component/">http://www.0to1code.com/one-pubsub-a-pubsub-library-for-lightning-web-component-and-aura-component/</a> --> 

About
-------------
Flashm is framework to reduce Apex server calls and enhance the performance of data fetching for Lightning Web Component. The framework stores the prmosis at browser's tab and it can be reused without making server call. Flashm is great when we are retriving same kind of data without network.

Use Case
-------------
Lets assume that we are loading configuration data from sObject/Custom Settings. We want to use this data on variuos place like utiltyi Bar, Multiple pages thoughrout the app. We are having 5 to 6 lightning web components on the page. These can be in hierarchy, utility bar and individual placed on the page. All of these are using basic configuration and making server calls for same data.
After using Flashm, this data will be loaded for only one time and can be used across the all pages. 

In my case, i was having 6-7 components on the page and 4 component in the utility bar with having 6 lightning page tabs. If i  dont use Flashm then it would cost me 60 Apex Server Calls and these get increasd as user navigate to the app many time. It can go to 10 to 100 easly. Aftter using Flashm, It is not only and only One.

How it Works and Why is Super Fast?
-------------
Flashm works as middleware between Lightningn Web Component and Apex Calls. It provides the memory to store the blocks and cells. You invoke Flashm then Flashm invokes the Apex call. Flashm is based on Blocks and Cells.
Block: is the address that is same for all the same Apex method. A block contains multiple cells.
Cell: Cell is place where the parameters and promises get stored. Cells provides the virtual memory. Parameters work as unique address for every cell in the block.

<div align="center">
  <img alt="Flashm"
       src="https://raw.githubusercontent.com/TheVishnuKumar/Flashm/master/Flashm%20Process.jpg">
</div>

As described in the diagram, Because every apex call is first checked in the Flashm memory. If a prmosis is found in the Flashm memory then it returns from the here instead of goinf to the server.

Features
-------------
- Super fast as it uses the Flashm memory to store the promises and return data if needed instead of making server call.
- You have control to erase cell, block and entire Flashm memory.
- If Flashm memory contains data and apex call is requested then it can be used without network as well. Ex: Can be used at Kiosks where app have limited searches.
- Reduce the Server load. Provide more lightning to your lightning app.

Considerations and Limitation
-------------
- Don't use when dealing with large data.
- Don't use to commit/DML to the server. Must be used to retirve the data from server.
- Take care while naming the Block address. Dont use same name for two different kind of Apex methods.
- Shold use flushCell in catch statements. So in case of error, Flashm dont store the error. In next call it tries a server call to retieve success result.
- Should not be used with cacheable methods.

Documentation
-------------
**Flashm:** Using is Flashm is very simple as you dont need to get worried when the promises get resolved. Flashm has four methods.


Methods
----------
1. **invoke**: This method is the entry point to Flashm and call the Apex methods. It has 4 parameters.
A: Block Address: Dont use same name for two different kind of Apex methods. For exm: Dont use getAccount as block address for getAccount() and getContact() apex methods. As it will store promise of first called method and then return this one only.
B: Apex Method: The name of apex method which is imported.
C: Parameters: (Optional) Pass the paramteter as you want in @AuraEnabled method.
D: Force Refresh: (Optional) Accept a boolean value. Default is false. If passed true then it always make server call instead of checking from the Flashm memomry.

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

2. **flushCell**: This methods removes the cell. Now, the next call will go to Server and stores the latest promise into the memory. It has 2 parameters.
A: Block Address
B: Paramemter: (Optional)
```javascript
flashm.flushCell( 'getUserFullInformation' , {name: searchStr} );
```

3. **flushBlock**: This methods removes the block and all the cells inside the block. It has one parameter.
A: Block Address
```javascript
flashm.flushBlock( 'getUserFullInformation' );
```

4. **flushAll**: This methods cleans out all the Flashm memory.
```javascript
flashm.flushAll();
```

Code on  <a href="https://gist.github.com/TheVishnuKumar/2f7fb4c8dba46142e14342391c56661c">gist</a>

Release
-------------
v1.0: Initial Release