$(document).foundation();

$(".self").on('mouseover', function () {
    $(this).addClass("animated jello");

    $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

        $(this).removeClass("animated jello");

    });

});


$(".hireme").addClass("animated bounceInDown");
$(".welcome").addClass("animated fadeInUp");

$(".hireme").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

    $(this).removeClass("animated bounceInDown");

    $(".welcome").on('mouseover', function () {

        $(this).removeClass("animated fadeInUp");
        
        $(this).addClass("animated rubberBand");

        $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

            $(this).removeClass("animated rubberBand");

        });

    });
    
    $(this).on('mouseover', function(){
        
        $(this).addClass("animated shake");        
        
    });
    
    $(this).on('mouseout', function(){
        
        $(this).removeClass("animated shake");        
        
    });
    

});


