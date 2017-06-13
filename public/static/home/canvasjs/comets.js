// even more awesome with this song playing ;)
// https://www.youtube.com/watch?v=0NKUpo_xKyQ
// ( lights )
var c = document.createElement('canvas');
document.body.appendChild(c);
// var c = document.querySelector('#c');
var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext( '2d' ),
    
    opts = {
      
      hitLine: h - 30,
      hitIntensity: 1,
      hitCoolDown: 4,
      holeAttenuator: 30,
      repaintAlpha: .02,
      
      gravity: 0.01,
      
      meteorCount: 15,
      meteorSpawnProb: .05,
      meteorBaseSize: 10,
      meteorAddedSize: 10,
      meteorBaseVelX: 2,
      meteorAddedVelX: -4,
      meteorBaseVelY: 2,
      meteorAddedVelY: 3,
      meteorTemplateColor: 'hsl( hue, 80%, light% )',
      
      ashCount: 20,
      ashSpawnProb: .08,
      ashBaseSizeMultiplier: .1,
      ashAddedSizeMultiplier: .1,
      ashLifeMultiplier: 10
    },
    
    meteors = [],
    holes = [],
    explosions = 0,
    tick = 0,
    someAreDead = false,
    
    tau = Math.PI * 2;


function init() {
  
  ctx.fillStyle = '#151515';
  ctx.fillRect( 0, 0, w, h );
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.save();
  
  meteors.length = 0;
  
  for( var i = 0; i < 100; ++i )
    loop_update();
  
  loop();
}
window.init = init;
function loop() {
  
  window.requestAnimationFrame( loop );
  
  loop_update();
  loop_render();
}

function loop_update() {
  
  loop_update_tick();
  
  loop_update_spawn();
  
  meteors.map( meteor => meteor.update() );
  holes.map( ( hole, i ) => hole.dead ? holes.splice( i, 1 ) : hole.update() );
}
function loop_render() {
  
  loop_render_repaint();
  
  loop_render_transform();
  
  loop_render_hitLine();
  
  ctx.globalCompositeOperation = 'lighter';
  
  meteors.map( meteor => meteor.render() );
  holes.map( hole => hole.render() );
}

function loop_update_tick() {
  
  tick += .6;
  tick %= 360;
  
  if( explosions > 0 )
    explosions -= 1 / opts.hitCoolDown;
  
  someAreDead = false;
}
function loop_update_spawn() {
  
  if( meteors.length < opts.meteorCount && Math.random() < opts.meteorSpawnProb )
    meteors.push( new Meteor );
}

function loop_render_repaint() {
  
  ctx.restore();
  
  ctx.fillStyle = 'rgba(0,0,0,alp)'
    .replace( 'alp', opts.repaintAlpha );
  ctx.fillRect( 0, 0, w, opts.hitLine );
  
  if( someAreDead ) {
    ctx.fillStyle = 'rgba(20,20,20,.1)';
 // ctx.fillRect( 0, 0, w, h );
  }
  
  ctx.save();
}
function loop_render_transform() {
  
  ctx.translate( Math.random() * opts.hitIntensity * explosions,
                 Math.random() * opts.hitIntensity * explosions );
}
function loop_render_hitLine() {
  
  ctx.fillStyle = 'rgba(20,20,20,alp)'
    .replace( 'alp', opts.repaintAlpha * 2 );
  ctx.fillRect( 0, opts.hitLine, w, h - opts.hitLine );
}


function Meteor() {
  
  this.reset();
}
Meteor.prototype.reset = function() {
  
  this.x = Math.random() * w;
  this.y = 0;
  this.vx = opts.meteorBaseVelX + Math.random() * opts.meteorAddedVelX;
  this.vy = opts.meteorBaseVelY + Math.random() * opts.meteorAddedVelY;
  
  this.size = ( opts.meteorBaseSize + Math.random() * opts.meteorAddedSize ) |0;
  this.y -= this.size;
  
  this.ashes = [];
  
  this.color = opts.meteorTemplateColor.replace( 'hue', tick );
}
Meteor.prototype.update = function() {
  
  this.x += this.vx;
  this.y += this.vy += opts.gravity;
  
  this.update_ashes();
  
  this.update_checkDead();
}
Meteor.prototype.render = function() {
  
  var color = opts.meteorTemplateColor.replace( 'hue', this.x / w * 100 + tick );
  
  ctx.fillStyle = color.replace( 'light', Math.random() * 30 + 25 );
  ctx.shadowColor = color.replace( 'light', Math.random() * 25 + 25 );
  ctx.shadowBlur = this.size;
  
  ctx.beginPath();
  ctx.arc( this.x |0, this.y |0, this.size /2, 0, tau );
  ctx.fill();
  
  ctx.fillStyle = ctx.shadowColor;
  this.render_ashes();
}

Meteor.prototype.update_ashes = function() {
  
  if( this.ashes.length < opts.ashCount && Math.random() < opts.ashSpawnProb )
    this.ashes.push( new Ash( this ) );
  
  this.ashes.map( ash => ash.update() );
}
Meteor.prototype.update_checkDead = function() {
  
  if( this.x > w + this.size )
    this.reset();
  
  if( this.y > opts.hitLine )
    this.update_checkDead_explode();
}
Meteor.prototype.update_checkDead_explode = function() {
  
  ++explosions;
  someAreDead = true;
  
  holes.push( new Hole( this ) );
  
  this.reset();
}

Meteor.prototype.render_ashes = function() {
  
  this.ashes.map( ash => ash.render() );
}


function Ash( meteor ) {
  
  this.reset( meteor );
}
Ash.prototype.reset = function( meteor ) {
  
  this.meteor = meteor;
  
  this.x = ( meteor.x + Math.random() * meteor.size * 2 - meteor.size ) |0;
  this.y = ( meteor.y + Math.random() * meteor.size * 2 - meteor.size ) |0;
  
  this.size = ( ( opts.ashBaseSizeMultiplier + Math.random() * opts.ashAddedSizeMultiplier ) * meteor.size ) |0;
  
  this.life = this.originalLife = ( this.size * opts.ashLifeMultiplier ) |0;
}
Ash.prototype.update = function() {
  
  --this.life;
  
  if( this.life <= 0 )
    this.reset( this.meteor );
}
Ash.prototype.render = function() {
  
  ctx.fillRect( this.x, this.y, this.size, this.size );
}

function Hole( meteor ) {
  
  this.x = meteor.x;
  this.size = meteor.size * 10;
  this.color = 'hsla(hue, 80%, 55%, .04)'.replace( 'hue', this.x / w * 100 + tick );
  this.life = 0;
}
Hole.prototype.update = function() {
  
  this.life += ( this.size - this.life ) / opts.holeAttenuator;
  
  if( this.life > this.size * .60 )
    this.dead = true;
}
Hole.prototype.render = function() {
  
  ctx.shadowBlur = 0;
  ctx.fillStyle = this.color;
  
  ctx.beginPath();
  ctx.arc( this.x, opts.hitLine, this.life, 0, tau );
  ctx.fill();
}

// init();

window.addEventListener( 'resize', function() {
  
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  
  ctx.fillStyle = '#151515';
  ctx.fillRect( 0, 0, w, h );
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.save();
})