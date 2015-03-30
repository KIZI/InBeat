var MinerXml = function(){

    var _ = require('underscore');

	var _getDictionary = function(data, params, callback){

		var datasetname = params.tablename;

		//var columns = data.slice(5);
        var columns = _.without(data,"accountId","userId","sessionId","last","objectId","parentObjectId","interest");

		//console.log(data,columns);
		//columns.splice(columns.indexOf('NonProfitOrganisation'), 1);



		var out = "";
		out += '<?xml version="1.0" encoding="utf-8"?>\n';
		out += '<PMML version="4.0" xmlns="http://www.dmg.org/PMML-4_0" xmlns:pmml="http://www.dmg.org/PMML-4_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.dmg.org/PMML-4_0 http://sewebar.vse.cz/schemas/PMML4.0+GUHA0.1.xsd">\n';
		out += '<Header copyright="Copyright (c) KIZI UEP">\n';
			out += '<Extension name="author" value=""/>\n';
			out += '<Extension name="format" value="4ftMiner.Task"/>\n';
			out += '<Extension name="dataset" value="'+datasetname+'"/>\n';
			out += '<Application name="SEWEBAR" version="1.0"/>\n'; 
			out += '<Annotation>DM Task export from SEWEBAR DB CONNECT</Annotation>\n';
			out += '<Timestamp>2013-05-25T10:00:01+00:00</Timestamp>\n'; 
		out += '</Header>\n';

		out += '<MiningBuildTask>\n';
			out += '<Extension name="DatabaseDictionary">\n';
			out += '<Table name="'+datasetname+'">\n';
			//out += '<Table name="'+datasetname+'" reloadTableInfo="yes">\n';
			out += '<Columns>\n';		
			
			//out += '<Column dataType="string" name="sessionId"/>\n';
			//out += '<Column dataType="string" name="objectId"/>\n';
			//out += '<Column dataType="string" name="subobjectId"/>\n';
			out += '<Column dataType="float" name="interest"/>\n';
			
			for(i=0;i<columns.length;i++){
				out += '<Column dataType="float" name="'+columns[i]+'"/>\n';
			}		
			out += '</Columns>\n';
			out += '<PrimaryKey>\n';
			out += '<Column name="id" primaryKeyPosition="0"/>\n';
			out += '</PrimaryKey>\n';
			out += '</Table>\n';
			out += '</Extension>\n';
		out += '</MiningBuildTask>\n';

		out += '<DataDictionary>\n';

			//out += '<DataField dataType="string" name="sessionId" optype="nominal"/>\n';
			//out += '<DataField dataType="string" name="objectId" optype="nominal"/>\n';
			//out += '<DataField dataType="string" name="subobjectId" optype="nominal"/>\n';
			out += '<DataField dataType="float" name="interest" optype="continuous"/>\n';
			for(i=0;i<columns.length;i++){				
				out += '<DataField dataType="float" name="'+columns[i]+'" optype="continuous"/>\n';
			}

		out += '</DataDictionary>\n';

		out += '<TransformationDictionary>\n';

			out += '<DerivedField name="interest" dataType="float" optype="continuous">\n';
	           	out += '<Discretize field="interest">\n';
		            
		            out += '<DiscretizeBin binValue="negative">\n';
		            out += '<Interval closure="closedOpen" leftMargin="-1000.0" rightMargin="0"/>\n';
		            out += '</DiscretizeBin>\n';
		            
		            out += '<DiscretizeBin binValue="positive">\n';
		            out += '<Interval closure="openClosed" leftMargin="0" rightMargin="1000.0"/>\n';
		            out += '</DiscretizeBin>\n';
		            
		            out += '<DiscretizeBin binValue="neutral">\n';
		            out += '<Interval closure="closedClosed" leftMargin="0" rightMargin="0"/>\n';		            
		            out += '</DiscretizeBin>\n';
	           	out += '</Discretize>\n';
       		out += '</DerivedField>\n';

       		for(i=0;i<columns.length;i++){				
				out += '<DerivedField name="'+columns[i]+'" dataType="float" optype="continuous">\n';
           		out += '<Discretize field="'+columns[i]+'">\n';
               	out += '<DiscretizeBin binValue="0">\n';
                out += '<Interval closure="closedClosed" leftMargin="0" rightMargin="0"/>\n';
               	out += '</DiscretizeBin>\n';
               	out += '<DiscretizeBin binValue="1">\n';
                out += '<Interval closure="openClosed" leftMargin="0" rightMargin="1"/>\n';
               	out += '</DiscretizeBin>\n';
           		out += '</Discretize>\n';
       			out += '</DerivedField>\n';
			}

		out += '</TransformationDictionary>\n';
		out += '</PMML>\n';

		callback(null, out);

	};


	var _getTask = function(data, params, callback){

		var datasetname = params.tablename;
        var columns = _.without(data,"accountId","userId","sessionId","last","objectId","parentObjectId","interest");

		var out = "";
		out += '<?xml version="1.0" encoding="UTF-8"?>\n';
		out += '<PMML xmlns="http://www.dmg.org/PMML-4_0" version="4.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:pmml="http://www.dmg.org/PMML-4_0" xsi:schemaLocation="http://www.dmg.org/PMML-4_0 http://sewebar.vse.cz/schemas/PMML4.0+GUHA0.1.xsd">\n';
		out += '<Header copyright="Copyright (c) KIZI UEP">\n';
			out += '<Extension name="dataset" value="'+datasetname+'"/>\n';
			out += '<Extension name="author" value="admin"/>\n';
			out += '<Extension name="subsystem" value="4ft-Miner"/>\n';
			out += '<Extension name="module" value="4ftResult.exe"/>\n';
			out += '<Extension name="format" value="4ftMiner.Task"/>\n';			
			out += '<Application name="SEWEBAR" version="1.0"/>\n'; 
			out += '<Annotation/>\n';
			out += '<Timestamp>2012-11-13T10:00:01+00:00</Timestamp>\n'; 
		out += '</Header>\n';
		out += '<DataDictionary/>\n';

		out += '<guha:AssociationModel xmlns="" xsi:schemaLocation="http://keg.vse.cz/ns/GUHA0.1rev1 http://sewebar.vse.cz/schemas/GUHA0.1rev1.xsd" xmlns:guha="http://keg.vse.cz/ns/GUHA0.1rev1" modelName="'+(datasetname+(new Date()).getTime())+'" functionName="associationRules" algorithmName="4ft">\n';
		out += '<TaskSetting>\n';
		out += '<Extension name="LISp-Miner"><HypothesesCountMax>50</HypothesesCountMax></Extension><Extension name="metabase" value="LM Barbora.mdb MB"/>\n';
		
		out += '<BBASettings>\n';

			for(i=0;i<columns.length;i++){	
				//if(columns[i].substring(0,1)==='r'){
					out += '<BBASetting id="'+columns[i]+'_BBA">\n';
		            	out += '<Text>'+columns[i]+'</Text>\n';
		            	out += '<Name>'+columns[i]+'</Name>\n';
		            	out += '<FieldRef>'+columns[i]+'</FieldRef>\n';
		            	out += '<Coefficient>\n';
		            		//out += '<Type>Subset</Type>\n';
		            		//out += '<MinimalLength>1</MinimalLength>\n';
		            		//out += '<MaximalLength>1</MaximalLength>\n';

		            		out += '<Type>One category</Type>\n';
		            		out += '<Category>1</Category>\n';

		            	out += '</Coefficient>\n';
		            out += '</BBASetting>\n';
		            //break;
		        //}
			}

			out += '<BBASetting id="cons_bba">\n';
            out += '<Text>interest</Text>\n';
            out += '<Name>interest</Name>\n';
            out += '<FieldRef>interest</FieldRef>\n';
            out += '<Coefficient>\n';
            out += '<Type>Subset</Type>\n';
            out += '<MinimalLength>1</MinimalLength>\n';
            out += '<MaximalLength>1</MaximalLength>\n';
            out += '</Coefficient>\n';
            out += '</BBASetting>\n';            
		out += '</BBASettings>\n';

		out += '<DBASettings>\n';

			for(i=0;i<columns.length;i++){	
				//if(columns[i].substring(0,1)==='r'){
					out += '<DBASetting id="'+columns[i]+'_DBA_PARTCEDENT" type="Conjunction">\n';
			            out += '<BASettingRef>'+columns[i]+'_DBA_LIT</BASettingRef>\n';
			            out += '<MinimalLength>0</MinimalLength>\n';
		            out += '</DBASetting>\n';
		            out += '<DBASetting id="'+columns[i]+'_DBA_LIT" type="Literal">\n';
			            out += '<BASettingRef>'+columns[i]+'_BBA</BASettingRef>\n';
			            out += '<LiteralSign>Positive</LiteralSign>\n';
		            out += '</DBASetting>\n';
		            //break;
				//}
			}

			out += '<DBASetting id="ant" type="Conjunction">\n';

				for(i=0;i<columns.length;i++){	
					//if(columns[i].substring(0,1)==='r'){	            		
	            		out += '<BASettingRef>'+columns[i]+'_DBA_PARTCEDENT</BASettingRef>\n';
	            		//break;
	            	//}
	            }
	            out += '<MinimalLength>1</MinimalLength>\n';
            out += '</DBASetting>\n';


			out += '<DBASetting id="cons" type="Conjunction">\n';
            out += '<BASettingRef>cons_cedent</BASettingRef>\n';
            out += '<MinimalLength>1</MinimalLength>\n';
            out += '</DBASetting>\n';

            out += '<DBASetting id="cons_cedent" type="Conjunction">\n';
            out += '<BASettingRef>cons_literal</BASettingRef>\n';
            out += '<MinimalLength>1</MinimalLength>\n';
            out += '</DBASetting>\n';

            out += '<DBASetting id="cons_literal" type="Literal">\n';
            out += '<BASettingRef>cons_bba</BASettingRef>\n';
            out += '<LiteralSign>Positive</LiteralSign>\n';
            out += '</DBASetting>\n';
		out += '</DBASettings>\n';				

		out += '<AntecedentSetting>ant</AntecedentSetting>\n';
        out += '<ConsequentSetting>cons</ConsequentSetting>\n';

		out += '<InterestMeasureSetting>\n';
        
        out += '<InterestMeasureThreshold id="imt1">\n';
        out += '<InterestMeasure>FUI</InterestMeasure>\n';
        out += '<Threshold>'+params.confidence+'</Threshold>\n';
        out += '<ThresholdType>% of all</ThresholdType>\n';
        out += '<CompareType>Greater than or equal</CompareType>\n';
        out += '</InterestMeasureThreshold>\n';

        out += '<InterestMeasureThreshold id="imt2">\n';
        out += '<InterestMeasure>BASE</InterestMeasure>\n';
        out += '<Threshold>'+params.support+'</Threshold>\n';
        out += '<ThresholdType>% of all</ThresholdType>\n';
        out += '<CompareType>Greater than or equal</CompareType>\n';
        out += '</InterestMeasureThreshold>\n';

        out += '</InterestMeasureSetting>\n';

		out += '</TaskSetting>\n';
		out += '</guha:AssociationModel>\n';
		out += '</PMML>\n';

		callback(null, out);
	};

	return {
		getDictionary: _getDictionary,
		getTask: _getTask

	};

}();
module.exports = MinerXml;