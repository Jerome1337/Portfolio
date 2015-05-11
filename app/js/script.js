$(document).foundation();

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            
            ga('create', 'UA-48200179-1', 'auto');
            ga('send', 'pageview');

$(document).ready(function(){

    // RequestAnimFrame: a browser API for getting smooth animations
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     ||  
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    var particules = document.getElementById("particules");

    var ctx = particules.getContext("2d");

    // Set the particules width and height to occupy full window
    var W = window.innerWidth, H = window.innerHeight;
    particules.width = W;
    particules.height = H;

    var particleCount = 250,
        particles = [],
        minDist = 150,
        dist;

    function paintParticules() {
       ctx.fillStyle = "rgba(60,70,74,1)";
       ctx.fillRect(0,0,W,H);
    }

    function Particle() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        
        this.vx = -1 + Math.random() * 2.5;
        this.vy = -1 + Math.random() * 2.5;

        this.radius = Math.random() * 6;

        this.draw = function() {
            ctx.fillStyle = "rgb(3,166,74)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            
            ctx.fill();
        }
    }

    for(var i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function draw() {
        
        paintParticules();
        
        for (var i = 0; i < particles.length; i++) {
            p = particles[i];
            p.draw();
        }
        
        update();
    }

    function update() {
        
        for (var i = 0; i < particles.length; i++) {
            p = particles[i];
            
            // Velocity
            p.x += p.vx;
            p.y += p.vy
                
            // Wall
            if(p.x + p.radius > W) 
                p.x = p.radius;
            
            else if(p.x - p.radius < 0) {
                p.x = W - p.radius;
            }
            
            if(p.y + p.radius > H) 
                p.y = p.radius;
            
            else if(p.y - p.radius < 0) {
                p.y = H - p.radius;
            }
            
            // Attract particles
            for(var j = i + 1; j < particles.length; j++) {
                p2 = particles[j];
                distance(p, p2);
            }
        
        }
    }

    function distance(p1, p2) {
        var dist,
            dx = p1.x - p2.x;
            dy = p1.y - p2.y;
        
        dist = Math.sqrt(dx*dx + dy*dy);
                
        if(dist <= minDist) {
            
            ctx.beginPath();
            ctx.strokeStyle = "rgba(46,204,113,"+ (1.2-dist/minDist) +")";
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.closePath();

            var ax = dx/10000,
                ay = dy/10000;
            
            p1.vx <= ax;
            p1.vy <= ay;
            
            p2.vx >= ax;
            p2.vy >= ay;
        }
    }

    function animloop() {
        draw();
        requestAnimFrame(animloop);
    }

    animloop();

    function handleMouseDown(e){
        mouseX=parseInt(e.clientX-offsetX);
        mouseY=parseInt(e.clientY-offsetY);

        Particle.draw = function() {
        ctx.fillStyle = "rgb(46,204,113)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        ctx.fill();
        }
    }

    nom = 'p-jerome';
    domaine = 'hotmail.fr';

    $('#mailAddr').append('<a href=\"mailto:' + nom + '@' + domaine + '\">' + nom + '@' + domaine + '</a>');

    $('#telNumb').append('<a href=\"tel:+33650010894\">06.50.01.08.94</a>');
});