/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */

const constants = require( "../dist/Constants" );

const spinalServiceGraph = require( "spinal-env-viewer-graph-service" );
const assert = require( 'chai' ).assert;
const DEFAULT_PROCESS_NAME = "Process 1";
const DEFAULT_STEP_NAME = "Step 1";
const DEFAULT_STEP_COLOR = "Color 1";
const DEFAULT_TICKET_NAME = "Ticket 1";
let SpinalServiceTicket;

describe( "Spinal Service Ticket", function () {
  
  beforeEach( async function () {
    try {
      await spinalServiceGraph.SpinalGraphService.setGraph( new spinalServiceGraph.SpinalGraph() );
      SpinalServiceTicket = require( "../dist" ).SpinalServiceTicket;
      SpinalServiceTicket.init();
    } catch ( e ) {
      console.log( e );
    }
  } );
  
  describe( "CreateContext()", function () {
    it( 'should create a new SpinalContext for the service', function ( done ) {
      SpinalServiceTicket.createContext().then( context => {
        assert.equal( typeof context !== "undefined", true );
        assert.equal( context.info.name.get(), constants.SERVICE_NAME );
        assert.equal( context.info.type.get(), constants.SERVICE_TYPE );
        return done();
      } ).catch( done );
    } );
  } );
  
  describe( "CreateProcess()", function () {
    it( 'should create a new process in the context', function ( done ) {
      SpinalServiceTicket.createProcess( DEFAULT_PROCESS_NAME )
        .then( process => {
          assert.typeOf( process, 'string' );
          done();
        } )
        .catch( done );
    } );
  } );
  
  describe( 'CreateStep()', function () {
    it( 'should create a step', function () {
      const stepId = SpinalServiceTicket.createStep( DEFAULT_STEP_NAME, DEFAULT_STEP_COLOR );
      assert.typeOf( stepId, 'string' );
    } );
  } );
  
  describe( 'CreateTicket()', function () {
    it( 'should create a ticket', function () {
      const ticketId = SpinalServiceTicket.createTicket( { name: DEFAULT_TICKET_NAME } );
      assert.typeOf( ticketId, 'string' );
    } );
  } );
  
  describe( 'CreateArchiveBranch()', function () {
    it( 'should create a new node archive', function ( done ) {
      SpinalServiceTicket.createArchives()
        .then( archiveId => {
          assert.isTrue( archiveId );
          done();
        } )
        .catch( done );
    } );
  } );
  
  describe( 'AddStep', function () {
    it( 'should add a step to a process', function ( done ) {
      SpinalServiceTicket.createProcess( DEFAULT_PROCESS_NAME )
        .then( async function ( processId ) {
          const stepId = SpinalServiceTicket.createStep( DEFAULT_STEP_NAME, DEFAULT_STEP_COLOR );
          return SpinalServiceTicket.addStep( stepId, processId )
            .then( ok => {
              assert.isTrue( ok );
              done();
            } )
            .catch( done );
        } )
        .catch( done );
    } );
  } );
  
  describe( 'AddTicket', function () {
    it( 'should add a ticket to a step', function ( done ) {
      SpinalServiceTicket.createProcess( DEFAULT_PROCESS_NAME )
        .then( async function ( processId ) {
          const stepId = SpinalServiceTicket.createStep( DEFAULT_STEP_NAME, DEFAULT_STEP_COLOR );
          return SpinalServiceTicket.addStep( stepId, processId )
            .then( ok => {
              assert.isTrue( ok );
              const ticketId = SpinalServiceTicket.createTicket( { name: DEFAULT_TICKET_NAME } );
              SpinalServiceTicket.addTicket( ticketId, stepId );
              done();
            } )
            .catch( done );
        } )
        .catch( done );
    } );
  } );
  
  describe( 'GetContext', function () {
    it( 'should return the context id of the service ticket', function ( done ) {
      SpinalServiceTicket.createContext().then( context => {
        assert.equal( typeof context !== "undefined", true );
        assert.equal( context.info.name.get(), constants.SERVICE_NAME );
        assert.equal( context.info.type.get(), constants.SERVICE_TYPE );
        return SpinalServiceTicket.getContext()
          .then( id => {
            assert.typeOf( id, 'string' );
            assert.equal( context.info.id.get(), id );
            return done();
          } )
          .catch( done );
        
      } ).catch( done );
    } );
  } );
  
  describe( 'GetAllProcess', function () {
    it( 'should return all process', function ( done ) {
      SpinalServiceTicket.createProcess( DEFAULT_PROCESS_NAME )
        .then( id => {
          const processIds = SpinalServiceTicket.getAllProcess();
          const info = spinalServiceGraph.SpinalGraphService.getNode( id );
          assert.equal( processIds.size, 1 );
          assert.equal( info.name.get(), DEFAULT_PROCESS_NAME );
          assert.isTrue( processIds.has( id ) );
          return done();
        } )
        .catch( done );
    } );
  } );
  
  describe( 'GetAllTickets', function () {
    it( 'should return all ticket id', function () {
      const ticketId1 = SpinalServiceTicket.createTicket( { name: DEFAULT_TICKET_NAME } );
      const ticketId2 = SpinalServiceTicket.createTicket( { name: DEFAULT_TICKET_NAME } );
      const ticketIds = SpinalServiceTicket.getAllTickets();
      
      assert.equal( ticketIds.size, 2 );
      assert.isTrue( ticketIds.has( ticketId1 ) );
      assert.isTrue( ticketIds.has( ticketId2 ) );
    } );
  } );
  
  describe( 'GetAllStepOfProcess', function () {
    it( 'should return all the step of a process', function ( done ) {
      SpinalServiceTicket.createProcess( DEFAULT_PROCESS_NAME )
        .then( async processId => {
          const stepId1 = SpinalServiceTicket.createStep( DEFAULT_STEP_NAME, DEFAULT_STEP_COLOR );
          const stepId2 = SpinalServiceTicket.createStep( DEFAULT_STEP_NAME, DEFAULT_STEP_COLOR );
          
          await SpinalServiceTicket.addStep( stepId1, processId );
          await SpinalServiceTicket.addStep( stepId2, processId );
          const stepIds = SpinalServiceTicket.getStepsFromProcess( processId );
          
          assert.equal( stepIds.length, 2 );
          assert.isTrue( stepIds.includes( stepId1 ) );
          assert.isTrue( stepIds.includes( stepId2 ) );
          return done();
        } )
        .catch( done );
      
      
    } );
  } );
  
  describe( 'GetAllTicketOfStep', function () {
    it( 'should return all the ticket of a step', function ( done ) {
      SpinalServiceTicket.createProcess( DEFAULT_PROCESS_NAME )
        .then( async ( processId ) => {
          const stepId1 = SpinalServiceTicket.createStep( DEFAULT_STEP_NAME, DEFAULT_STEP_COLOR );
          const ticketId = SpinalServiceTicket.createTicket( { name: DEFAULT_TICKET_NAME } );
          
          await SpinalServiceTicket.addTicket( ticketId, stepId1 );
          const ticketIds = SpinalServiceTicket.getTicketsFromStep( stepId1 );
          
          assert.equal( ticketIds.length, 1 );
          assert.isTrue( ticketIds.includes( ticketId ) );
          
          return done();
        } )
        .catch( done );
    } );
  } );
  
  
  describe( 'GetAllTicketByProcess', function () {
    it( 'should return all ticket of a process', function () {
    
    } );
  } );

  describe( 'DeleteTicket', function () {
    it( 'should delete a ticket', function () {
      assert.isTrue( false );
    } );
  } );
  
  describe( 'DeleteStep', function () {
    it( 'should delete a step', function () {
      assert.isTrue( false );
    } );
  } );
  
  describe( 'DeleteProcess', function () {
    it( 'should delete a process', function () {
      assert.isTrue( false );
    } );
  } );
  
  describe( 'MoveTicketToArchive', function () {
    it( 'should move a ticket to the archive', function () {
      assert.isTrue( false );
    } );
  } );
  
  describe( 'MoveStepToArchive', function () {
    it( 'should move a step and its tickets to the archive', function () {
      assert.isTrue( false );
    } );
  } );
  
  describe( 'MoveProcessToArchive', function () {
    it( 'should move a process its steps and theirs processes to the archive', function () {
      assert.isTrue( false );
    } );
  } );
  
  describe( 'MoveTicketStep', function () {
    it( 'should move a ticket from a step to another', function () {
      assert.isTrue( false );
    } );
  } );
  
  describe( 'ModifyTicket', function () {
    it( 'should modify the information of a ticket', function () {
      assert.isTrue( false );
    } );
  } );
  describe( 'ModifyStep', function () {
    it( 'should modify the information of a step', function () {
      assert.isTrue( false );
    } );
  } );
  describe( 'ModifyProcess', function () {
    it( 'should modify the information of a step', function () {
      assert.isTrue( false );
    } );
  } );
  
  describe( 'GetAllTicketOfUser', function () {
    it( 'should return all the ticket of a user', function () {
      assert.isTrue( false );
    } );
  } );
} );