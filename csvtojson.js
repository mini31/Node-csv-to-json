var fs=require('fs');
var lineReader = require('readline').createInterface({
 input : fs.createReadStream('FoodFacts.csv') 
});
var i=0;
var linearray=[];
var headerline = 0;
var cIndex=0,saltIndex=0,sugarIndex=0,fatIndex=0,protienIndex=0,carboIndex=0;
var countryArray = ['Netherlands', 'Canada', 'United Kingdom' , 'United States' , 'Australia' , 'France' , 'Germany' , 'Spain', 'South Africa'];
var north = ['United Kingdom', 'Denmark', 'Sweden','Norway'];
var central  = ['France', 'Belgium', 'Germany', 'Switzerland','Netherlands'];
var South = ['Portugal', 'Greece', 'Italy', 'Spain', 'Croatia','Albania'];
var sugarArray = [];
var saltArray = [];
var nfatArray =0;
var nprotienArray=0;
var ncarboArray =0;
var cfatArray =0;
var cprotienArray =0;
var ccarboArray =0;
var sfatArray =0;
var sprotienArray=0;
var scarboArray=0;
var exist = false,existn=false,existc=false,exists=false;
var jsonArray = [];
var Europe=[];
for(var i=0;i<countryArray.length;i++)
	{
		sugarArray[i]=0;
		saltArray[i]=0;
	}
for(var i=0;i<north.length;i++)
{
	nfatArray[i]=0;
	ncarboArray[i]=0;
	nprotienArray[i]=0;
}
for(var i=0;i<central.length;i++)
{
	cfatArray[i]=0;
	ccarboArray[i]=0;
	cprotienArray[i]=0;
}
for(var i=0;i<South.length;i++)
{
	sfatArray[i]=0;
	scarboArray[i]=0;
	sprotienArray[i]=0;
}
lineReader.on('line',function(line)
{
	linearray = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

	if(headerline==0)
	{
		cIndex = linearray.indexOf("countries_en");
		saltIndex = linearray.indexOf("salt_100g");
		sugarIndex = linearray.indexOf("sugars_100g");
		protienIndex = linearray.indexOf("proteins_100g");
		carboIndex = linearray.indexOf("carbohydrates_100g");
		fatIndex = linearray.indexOf("fat_100g");
		headerline++;
	}	
		exist = countryArray.includes(linearray[cIndex]);	
		existn = north.includes(linearray[cIndex]);
		existc = central.includes(linearray[cIndex]);
		exists = South.includes(linearray[cIndex]);
	if(exist)
	{
		var index = countryArray.indexOf(linearray[cIndex]);
		var salt = linearray[saltIndex],sugar=linearray[sugarIndex];

		if(salt=="")
			salt=0;
		if(sugar=="")
			sugar=0;

		saltArray[index]+=parseFloat(salt);
		sugarArray[index]+=sugarArray[index]+parseFloat(sugar);
		exist = false;
	}
	if(existn)
	{
		var nfat = linearray[fatIndex],nprotien=linearray[protienIndex],ncarbo=linearray[carboIndex];
		if(nfat=="")
			nfat=0;
		if(ncarbo=="")
			ncarbo=0;
		if(nprotien=="")
			nprotien=0;

		nfatArray+=parseFloat(nfat);
		ncarboArray+=parseFloat(ncarbo);
		nprotienArray+=parseFloat(nprotien);
		existn=false;
	}
	if(existc)
	{
		var cfat = linearray[fatIndex],cprotien=linearray[protienIndex],ccarbo=linearray[carboIndex];
		if(cfat=="")
			cfat=0;
		if(cprotien=="")
			cprotien=0;
		if(ccarbo=="")
			ccarbo=0;

		cfatArray+=parseFloat(cfat);
		cprotienArray+=parseFloat(cprotien);
		ccarboArray+=parseFloat(ccarbo);
		existc=false;
	}
	if(exists)
	{
		var sfat = linearray[fatIndex],sprotien=linearray[protienIndex],scarbo=linearray[carboIndex];
		if(sfat=="")
			sfat=0;
		if(sprotien=="")
			sprotien=0;
		if(scarbo=="")
			scarbo=0;

		sfatArray+=parseFloat(sfat);
		sprotienArray+=parseFloat(sprotien);
		scarboArray+=parseFloat(scarbo);
		exists=false;
	}
	
	});
	lineReader.on('close',function ()
	{
		for(var i=0;i<countryArray.length;i++)
		{
			var obj = {};
			obj["country"] = countryArray[i];
			obj["salt"] = saltArray[i];
			obj["sugar"] = sugarArray[i];
			jsonArray.push(obj);
		}
		
			var nobj = {};
			nobj["country"] = "NorthEurope";
			nobj["Fat"] = nfatArray;
			nobj["Protien"] = nprotienArray;
			nobj["carbohydrates"] = ncarboArray;
			Europe.push(nobj);

			var cobj= {};
			cobj["country"] = "CentralEurope";
			cobj["Fat"] = cfatArray;
			cobj["Protien"] = cprotienArray;
			cobj["carbohydrates"] = ccarboArray;
			Europe.push(cobj);

			var sobj={};
			sobj["country"] = "SouthEurope";
			sobj["Fat"] = sfatArray;
			sobj["Protien"] = sprotienArray;
			sobj["carbohydrates"] = scarboArray;
			Europe.push(sobj);

		fs.writeFile('converted.json', JSON.stringify(jsonArray) , 'utf-8');
		fs.writeFile('Multiline.json',JSON.stringify(Europe),'utf-8');
	});
