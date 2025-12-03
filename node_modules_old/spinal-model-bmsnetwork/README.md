<!-- DO NOT EDIT README.md (It will be overridden by README.hbs) -->

# spinal-model-bmsnetwork

Model + service using the spinal-model-graph to do operation for Network representation.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Description](#description)
- [API](#api)
  - [Interface](#interface)
    - [InputDataDevice](#inputdatadevice)
    - [InputDataEndpointGroup](#inputdataendpointgroup)
    - [InputDataDevice](#inputdatadevice-1)
    - [ConfigService](#configservice)
  - [Classes](#classes)
  - [Functions](#functions)
  - [SpinalBmsDevice ⇐ <code>Model</code>](#spinalbmsdevice-%E2%87%90-codemodelcode)
    - [SpinalBmsDevice.SpinalBmsDevice](#spinalbmsdevicespinalbmsdevice)
      - [new SpinalBmsDevice([name], [type], [path], [id])](#new-spinalbmsdevicename-type-path-id)
  - [SpinalBmsEndpoint ⇐ <code>Model</code>](#spinalbmsendpoint-%E2%87%90-codemodelcode)
    - [SpinalBmsEndpoint.SpinalBmsEndpoint](#spinalbmsendpointspinalbmsendpoint)
      - [new SpinalBmsEndpoint([name], [path], [currentValue], [unit], [dataType], [type], [id])](#new-spinalbmsendpointname-path-currentvalue-unit-datatype-type-id)
  - [SpinalBmsEndpointGroup ⇐ <code>Model</code>](#spinalbmsendpointgroup-%E2%87%90-codemodelcode)
    - [SpinalBmsEndpointGroup.SpinalBmsEndpointGroup](#spinalbmsendpointgroupspinalbmsendpointgroup)
      - [new SpinalBmsEndpointGroup([name], [type], [path], [id])](#new-spinalbmsendpointgroupname-type-path-id)
  - [SpinalBmsNetwork ⇐ <code>Model</code>](#spinalbmsnetwork-%E2%87%90-codemodelcode)
    - [SpinalBmsNetwork.SpinalBmsNetwork](#spinalbmsnetworkspinalbmsnetwork)
      - [new SpinalBmsNetwork([name], [type], [id])](#new-spinalbmsnetworkname-type-id)
  - [NetworkService](#networkservice)
    - [networkService.init(forgeFile, configService, [autoCreate]) ⇒ <code>Promise.&lt;{contextId:string, networkId: string}&gt;</code>](#networkserviceinitforgefile-configservice-autocreate-%E2%87%92-codepromiseltcontextidstring-networkid-stringgtcode)
    - [networkService.createNewBmsNetwork(parentId, typeName, networkName) ⇒ <code>Promise.&lt;any&gt;</code>](#networkservicecreatenewbmsnetworkparentid-typename-networkname-%E2%87%92-codepromiseltanygtcode)
    - [networkService.createNewBmsDevice(parentId, obj) ⇒ <code>Promise.&lt;any&gt;</code>](#networkservicecreatenewbmsdeviceparentid-obj-%E2%87%92-codepromiseltanygtcode)
    - [networkService.createNewBmsEndpointGroup(parentId, obj) ⇒ <code>Promise.&lt;any&gt;</code>](#networkservicecreatenewbmsendpointgroupparentid-obj-%E2%87%92-codepromiseltanygtcode)
    - [networkService.createNewBmsEndpoint(parentId, obj) ⇒ <code>Promise.&lt;any&gt;</code>](#networkservicecreatenewbmsendpointparentid-obj-%E2%87%92-codepromiseltanygtcode)
    - [networkService.updateData(obj, [date]) ⇒ <code>Promise.&lt;void&gt;</code>](#networkserviceupdatedataobj-date-%E2%87%92-codepromiseltvoidgtcode)
    - [networkService.updateEndpoint(node, reference, [date]) ⇒ <code>Promise.&lt;void&gt;</code>](#networkserviceupdateendpointnode-reference-date-%E2%87%92-codepromiseltvoidgtcode)
    - [networkService.getNetworks() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>](#networkservicegetnetworks-%E2%87%92-codepromiseltarrayltstringgtgtcode)
    - [networkService.getEndpoint(idDevice) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>](#networkservicegetendpointiddevice-%E2%87%92-codepromiseltarrayltstringgtgtcode)
    - [networkService.getInfo(idNode) ⇒ <code>spinal.Model</code>](#networkservicegetinfoidnode-%E2%87%92-codespinalmodelcode)
    - [networkService.getData(idNode) ⇒ <code>Promise.&lt;spinal.Model&gt;</code>](#networkservicegetdataidnode-%E2%87%92-codepromiseltspinalmodelgtcode)
    - [networkService.getTimeseries(idEndpoint) ⇒ <code>Promise.&lt;SpinalTimeSeries&gt;</code>](#networkservicegettimeseriesidendpoint-%E2%87%92-codepromiseltspinaltimeseriesgtcode)
    - [networkService.setEndpointValue(idEndpoint, value, [date]) ⇒ <code>Promise.&lt;boolean&gt;</code>](#networkservicesetendpointvalueidendpoint-value-date-%E2%87%92-codepromiseltbooleangtcode)
    - [NetworkService.NetworkService](#networkservicenetworkservice)
      - [new NetworkService()](#new-networkservice)
  - [InputDataEndpointDataType : <code>enum</code>](#inputdataendpointdatatype--codeenumcode)
  - [InputDataEndpointType : <code>enum</code>](#inputdataendpointtype--codeenumcode)
  - [genUID(constructor) ⇒ <code>string</code>](#genuidconstructor-%E2%87%92-codestringcode)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Description

Model + service using the spinal-model-graph to do operation for Network representation.


# API

## Interface

<a name="InputDataDevice"></a>

### InputDataDevice
**Kind**: interface

| Param | Type | Value | Comment |
| --- | --- | | |
| id | <code>string</code> | | 
| name | <code>string</code> | | 
| type | <code>string</code> | | 
| path | <code>string</code> | | 
| children | <code>(InputDataEndpoint \| InputDataEndpointGroup \| InputDataDevice)[]</code> | | 
| nodeTypeName | <code>string</code> | <code>BmsDevice</code> | should equal to <code>SpinalBmsDevice.nodeTypeName</code> |

<a name="InputDataEndpointGroup"></a>

### InputDataEndpointGroup
**Kind**: interface

| Param | Type | Value | Comment |
| --- | --- | --- | --- |
| id | <code>string</code> | | 
| name | <code>string</code> | | 
| type | <code>string</code> | | 
| path | <code>string</code> | | 
| children | <code>InputDataEndpoint[]</code> | | 
| nodeTypeName | <code>string</code> | <code>BmsEndpointGroup</code> | should equal to <code>SpinalBmsEndpointGroup.nodeTypeName</code> |

<a name="InputDataDevice"></a>

### InputDataDevice
**Kind**: interface

| Param | Type | Value | Comment |
| --- | --- | --- | --- |
| id | <code>string</code> | | 
| name | <code>string</code> | | 
| path | <code>string</code> | | 
| currentValue | <code>string</code> | | 
| unit | <code>(InputDataEndpoint \| InputDataEndpointGroup \| InputDataDevice)[]</code> | | 
| dataType | <code>InputDataEndpointDataType</code> | | 
| type | <code>InputDataEndpointType</code> | | 
| nodeTypeName | <code>string</code> | <code>BmsEndpoint</code> | should equal to <code>SpinalBmsEndpoint.nodeTypeName</code> |

<a name="ConfigService"></a>

### ConfigService
**Kind**: interface

| Param | Type | Value | Comment |
| --- | --- | --- | --- |
| contextName | <code>string</code> | | 
| contextType | <code>string</code> | | 
| networkType | <code>string</code> | | 
| networkName | <code>string</code> | | 



## Classes

<dl>
<dt><a href="#SpinalBmsDevice">SpinalBmsDevice</a> ⇐ <code>Model</code></dt>
<dd></dd>
<dt><a href="#SpinalBmsEndpoint">SpinalBmsEndpoint</a> ⇐ <code>Model</code></dt>
<dd></dd>
<dt><a href="#SpinalBmsEndpointGroup">SpinalBmsEndpointGroup</a> ⇐ <code>Model</code></dt>
<dd></dd>
<dt><a href="#SpinalBmsNetwork">SpinalBmsNetwork</a> ⇐ <code>Model</code></dt>
<dd></dd>
<dt><a href="#NetworkService">NetworkService</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#genUID">genUID(constructor)</a> ⇒ <code>string</code></dt>
<dd></dd>
</dl>

<a name="SpinalBmsDevice"></a>

## SpinalBmsDevice ⇐ <code>Model</code>
**Kind**: global class  
**Extends**: <code>Model</code>  
**Export**:   
**Properties**

| Name | Type |
| --- | --- |
| id; | <code>spinal.Str</code> | 
| name; | <code>spinal.Str</code> | 
| type; | <code>spinal.Str</code> | 
| path; | <code>spinal.Str</code> | 


* [SpinalBmsDevice](#SpinalBmsDevice) ⇐ <code>Model</code>
    * [.SpinalBmsDevice](#SpinalBmsDevice.SpinalBmsDevice)
        * [new SpinalBmsDevice([name], [type], [path], [id])](#new_SpinalBmsDevice.SpinalBmsDevice_new)

<a name="SpinalBmsDevice.SpinalBmsDevice"></a>

### SpinalBmsDevice.SpinalBmsDevice
**Kind**: static class of [<code>SpinalBmsDevice</code>](#SpinalBmsDevice)  
<a name="new_SpinalBmsDevice.SpinalBmsDevice_new"></a>

#### new SpinalBmsDevice([name], [type], [path], [id])
<p>Creates an instance of SpinalBmsDevice.</p>


| Param | Type | Default |
| --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [type] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [path] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [id] | <code>string</code> | <code>&quot;genUID(&#x27;SpinalBmsDevice&#x27;)&quot;</code> | 

<a name="SpinalBmsEndpoint"></a>

## SpinalBmsEndpoint ⇐ <code>Model</code>
**Kind**: global class  
**Extends**: <code>Model</code>  
**Export**:   
**Properties**

| Name | Type |
| --- | --- |
| id | <code>spinal.Str</code> | 
| path | <code>spinal.Str</code> | 
| currentValue | <code>spinal.Str</code> \| <code>spinal.Val</code> | 
| unit | <code>spinal.Str</code> | 
| type | <code>spinal.Str</code> | 
| dataType | <code>spinal.Str</code> | 


* [SpinalBmsEndpoint](#SpinalBmsEndpoint) ⇐ <code>Model</code>
    * [.SpinalBmsEndpoint](#SpinalBmsEndpoint.SpinalBmsEndpoint)
        * [new SpinalBmsEndpoint([name], [path], [currentValue], [unit], [dataType], [type], [id])](#new_SpinalBmsEndpoint.SpinalBmsEndpoint_new)

<a name="SpinalBmsEndpoint.SpinalBmsEndpoint"></a>

### SpinalBmsEndpoint.SpinalBmsEndpoint
**Kind**: static class of [<code>SpinalBmsEndpoint</code>](#SpinalBmsEndpoint)  
<a name="new_SpinalBmsEndpoint.SpinalBmsEndpoint_new"></a>

#### new SpinalBmsEndpoint([name], [path], [currentValue], [unit], [dataType], [type], [id])
<p>Creates an instance of SpinalBmsEndpoint.</p>


| Param | Type | Default |
| --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [path] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [currentValue] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [unit] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [dataType] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [type] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [id] | <code>string</code> | <code>&quot;genUID(&#x27;SpinalBmsEndpoint&#x27;)&quot;</code> | 

<a name="SpinalBmsEndpointGroup"></a>

## SpinalBmsEndpointGroup ⇐ <code>Model</code>
**Kind**: global class  
**Extends**: <code>Model</code>  
**Export**:   
**Properties**

| Name | Type |
| --- | --- |
| id; | <code>spinal.Str</code> | 
| name; | <code>spinal.Str</code> | 
| type; | <code>spinal.Str</code> | 
| path; | <code>spinal.Str</code> | 


* [SpinalBmsEndpointGroup](#SpinalBmsEndpointGroup) ⇐ <code>Model</code>
    * [.SpinalBmsEndpointGroup](#SpinalBmsEndpointGroup.SpinalBmsEndpointGroup)
        * [new SpinalBmsEndpointGroup([name], [type], [path], [id])](#new_SpinalBmsEndpointGroup.SpinalBmsEndpointGroup_new)

<a name="SpinalBmsEndpointGroup.SpinalBmsEndpointGroup"></a>

### SpinalBmsEndpointGroup.SpinalBmsEndpointGroup
**Kind**: static class of [<code>SpinalBmsEndpointGroup</code>](#SpinalBmsEndpointGroup)  
<a name="new_SpinalBmsEndpointGroup.SpinalBmsEndpointGroup_new"></a>

#### new SpinalBmsEndpointGroup([name], [type], [path], [id])
<p>Creates an instance of SpinalBmsEndpointGroup.</p>


| Param | Type | Default |
| --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [type] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [path] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [id] | <code>string</code> | <code>&quot;genUID(&#x27;SpinalBmsNetwork&#x27;)&quot;</code> | 

<a name="SpinalBmsNetwork"></a>

## SpinalBmsNetwork ⇐ <code>Model</code>
**Kind**: global class  
**Extends**: <code>Model</code>  
**Export**:   
**Properties**

| Name | Type |
| --- | --- |
| name | <code>spinal.Str</code> | 
| type | <code>spinal.Str</code> | 
| id | <code>spinal.Str</code> | 


* [SpinalBmsNetwork](#SpinalBmsNetwork) ⇐ <code>Model</code>
    * [.SpinalBmsNetwork](#SpinalBmsNetwork.SpinalBmsNetwork)
        * [new SpinalBmsNetwork([name], [type], [id])](#new_SpinalBmsNetwork.SpinalBmsNetwork_new)

<a name="SpinalBmsNetwork.SpinalBmsNetwork"></a>

### SpinalBmsNetwork.SpinalBmsNetwork
**Kind**: static class of [<code>SpinalBmsNetwork</code>](#SpinalBmsNetwork)  
<a name="new_SpinalBmsNetwork.SpinalBmsNetwork_new"></a>

#### new SpinalBmsNetwork([name], [type], [id])
<p>Creates an instance of SpinalBmsNetwork.</p>


| Param | Type | Default |
| --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [type] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [id] | <code>string</code> | <code>&quot;genUID(&#x27;SpinalBmsNetwork&#x27;)&quot;</code> | 

<a name="NetworkService"></a>

## NetworkService
**Kind**: global class  
**Export**:   

* [NetworkService](#NetworkService)
    * _instance_
        * [.init(forgeFile, configService, [autoCreate])](#NetworkService+init) ⇒ <code>Promise.&lt;{contextId:string, networkId: string}&gt;</code>
        * [.createNewBmsNetwork(parentId, typeName, networkName)](#NetworkService+createNewBmsNetwork) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.createNewBmsDevice(parentId, obj)](#NetworkService+createNewBmsDevice) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.createNewBmsEndpointGroup(parentId, obj)](#NetworkService+createNewBmsEndpointGroup) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.createNewBmsEndpoint(parentId, obj)](#NetworkService+createNewBmsEndpoint) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.updateData(obj, [date])](#NetworkService+updateData) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.updateEndpoint(node, reference, [date])](#NetworkService+updateEndpoint) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getNetworks()](#NetworkService+getNetworks) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
        * [.getEndpoint(idDevice)](#NetworkService+getEndpoint) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
        * [.getInfo(idNode)](#NetworkService+getInfo) ⇒ <code>spinal.Model</code>
        * [.getData(idNode)](#NetworkService+getData) ⇒ <code>Promise.&lt;spinal.Model&gt;</code>
        * [.getTimeseries(idEndpoint)](#NetworkService+getTimeseries) ⇒ <code>Promise.&lt;SpinalTimeSeries&gt;</code>
        * [.setEndpointValue(idEndpoint, value, [date])](#NetworkService+setEndpointValue) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * _static_
        * [.NetworkService](#NetworkService.NetworkService)
            * [new NetworkService()](#new_NetworkService.NetworkService_new)

<a name="NetworkService+init"></a>

### networkService.init(forgeFile, configService, [autoCreate]) ⇒ <code>Promise.&lt;{contextId:string, networkId: string}&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type | Default |
| --- | --- | --- |
| forgeFile | <code>spinal.Model</code> |  | 
| configService | <code>ConfigService</code> |  | 
| [autoCreate] | <code>boolean</code> | <code>true</code> | 

<a name="NetworkService+createNewBmsNetwork"></a>

### networkService.createNewBmsNetwork(parentId, typeName, networkName) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type |
| --- | --- |
| parentId | <code>string</code> | 
| typeName | <code>string</code> | 
| networkName | <code>string</code> | 

<a name="NetworkService+createNewBmsDevice"></a>

### networkService.createNewBmsDevice(parentId, obj) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type |
| --- | --- |
| parentId | <code>string</code> | 
| obj | <code>InputDataDevice</code> | 

<a name="NetworkService+createNewBmsEndpointGroup"></a>

### networkService.createNewBmsEndpointGroup(parentId, obj) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type |
| --- | --- |
| parentId | <code>string</code> | 
| obj | <code>InputDataEndpointGroup</code> | 

<a name="NetworkService+createNewBmsEndpoint"></a>

### networkService.createNewBmsEndpoint(parentId, obj) ⇒ <code>Promise.&lt;any&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type |
| --- | --- |
| parentId | <code>string</code> | 
| obj | <code>InputDataEndpoint</code> | 

<a name="NetworkService+updateData"></a>

### networkService.updateData(obj, [date]) ⇒ <code>Promise.&lt;void&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type | Default |
| --- | --- | --- |
| obj | <code>InputDataDevice</code> |  | 
| [date] | <code>\*</code> | <code></code> | 

<a name="NetworkService+updateEndpoint"></a>

### networkService.updateEndpoint(node, reference, [date]) ⇒ <code>Promise.&lt;void&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type | Default |
| --- | --- | --- |
| node | <code>\*</code> |  | 
| reference | <code>InputDataEndpoint</code> |  | 
| [date] | <code>\*</code> | <code></code> | 

<a name="NetworkService+getNetworks"></a>

### networkService.getNetworks() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  
<a name="NetworkService+getEndpoint"></a>

### networkService.getEndpoint(idDevice) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type |
| --- | --- |
| idDevice | <code>string</code> | 

<a name="NetworkService+getInfo"></a>

### networkService.getInfo(idNode) ⇒ <code>spinal.Model</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type |
| --- | --- |
| idNode | <code>string</code> | 

<a name="NetworkService+getData"></a>

### networkService.getData(idNode) ⇒ <code>Promise.&lt;spinal.Model&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type |
| --- | --- |
| idNode | <code>string</code> | 

<a name="NetworkService+getTimeseries"></a>

### networkService.getTimeseries(idEndpoint) ⇒ <code>Promise.&lt;SpinalTimeSeries&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type |
| --- | --- |
| idEndpoint | <code>string</code> | 

<a name="NetworkService+setEndpointValue"></a>

### networkService.setEndpointValue(idEndpoint, value, [date]) ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of [<code>NetworkService</code>](#NetworkService)  

| Param | Type | Default |
| --- | --- | --- |
| idEndpoint | <code>string</code> |  | 
| value | <code>string</code> \| <code>boolean</code> \| <code>number</code> |  | 
| [date] | <code>number</code> \| <code>string</code> \| <code>Date</code> | <code></code> | 

<a name="NetworkService.NetworkService"></a>

### NetworkService.NetworkService
**Kind**: static class of [<code>NetworkService</code>](#NetworkService)  
<a name="new_NetworkService.NetworkService_new"></a>

#### new NetworkService()
<p>Creates an instance of NetworkService.</p>

<a name="InputDataEndpointDataType"></a>

## InputDataEndpointDataType : <code>enum</code>
**Kind**: global enum  
<a name="InputDataEndpointType"></a>

## InputDataEndpointType : <code>enum</code>
**Kind**: global enum  
<a name="genUID"></a>

## genUID(constructor) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| constructor | <code>string</code> | 

