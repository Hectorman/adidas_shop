var shop = new Vue({
    el: '#app',
    data: {
        colores: [],
        tallas: [],
        product: {
            'descuento' : 20,
            'cantidad' : 1,
            variantes: []
        },
        carrito: [],
        ordenActiva : {
            talla: 0,
            color: 'Red'
        }
    },
    beforeMount: function() {

        var vueObj = this;

        $.getJSON('https://graditest-store.myshopify.com/products/free-trainer-3-mmw.js', function(jsonProduct) {
            
            vueObj.product.titulo = jsonProduct.title;

            vueObj.product.variantes = jsonProduct.variants;

            vueObj.getColorOptions( jsonProduct.variants );

            vueObj.getTallaOptions( jsonProduct.variants );

            vueObj.product.color = jsonProduct.variants[0].option1;

            vueObj.product.talla = jsonProduct.variants[0].option2;

            vueObj.$forceUpdate();

        });

    },
    mounted: function() {

        if ( $(window).width() > 900 ) {

            $('#carousel').flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: false,
                slideshow: false,
                itemWidth: 80,
                itemMargin: 0,
                minItems: 4,
                maxItems: 4,
                asNavFor: '#slider'
            });
                 
            $('#slider').flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: false,
                slideshow: true,
                sync: "#carousel"
            });

        } else {

            $('#slider').flexslider({
                animation: "slide",
                slideshow: true,
            });

        }
        
    },
    computed: {

        totalCarrito: function() {

            var total = 0;

            for (let index = 0; index < this.carrito.length; index++) {
                const orden = this.carrito[index];
                
                total+= this.precioFinal( orden, false, true );

            }

            return total;

        }

    },
    methods: {

        getColorOptions: function( variantes ) {

            for (let index = 0; index < variantes.length; index++) {
                const variante = variantes[index];

                if ( this.colores.indexOf( variante.option1 ) == -1 ) {

                    this.colores.push( variante.option1 )

                }
                
            }

        },

        getTallaOptions: function( variantes ) {

            for (let index = 0; index < variantes.length; index++) {
                const variante = variantes[index];

                if ( this.tallas.indexOf( variante.option2 ) == -1 ) {

                    this.tallas.push( variante.option2 )

                }
                
            }

        },

        changeColor: function(e) {

            this.product.color = $(e.target).data('color');

            this.$forceUpdate();

        },

        changeTalla: function(e) {

            this.product.talla = $(e.target).data('talla');

            this.$forceUpdate();

        },

        add: function(e) {

            this.product.cantidad++;

        },

        remove: function(e) {

            if ( this.product.cantidad == 1 ) return;

            this.product.cantidad--;

        },

        precioFinal: function( producto, unico, descuento ) {

            var precioVariante = this.getPrecioVariante();

            return Math.floor( ( producto.descuento && descuento ? precioVariante - ( precioVariante * ( producto.descuento / 100 ) ) : precioVariante ) * ( unico ? 1 : producto.cantidad ) );

        },

        getPrecioVariante: function(){

            for (let index = 0; index < this.product.variantes.length; index++) {
                const variante = this.product.variantes[index];
                
                if ( this.product.color == variante.option1 && this.product.talla == variante.option2 ) {

                    return variante.price

                }

            }

            return false;

        },

        addToCart: function() {

            $('.agregado').show();

            $('body').addClass('showPopup no-trans');

            setTimeout(function(){

                $('body').removeClass('cart-only');

            },20);

            setTimeout(function(){

                $('body').removeClass('no-trans');

            },400);

            this.ordenActiva = {
                ...this.product
            };

            this.carrito.push( this.ordenActiva );

            this.setOrdenActive( this.ordenActiva, this.carrito.length - 1 );

        },

        setOrdenActive: function( orden, index ) {

            this.ordenActiva = orden;

            setTimeout(function(){

                $('.carlist > div').eq( index ).addClass('active').siblings().removeClass('active');

            }, 20);

            $('body').removeClass('cart-only');

        },

        borrarOrden: function(e) {

            var $parent = $(e.target).parent(),
                index = $parent.index(),
                $activeOrden = $('.carlist > div.active');

            this.carrito.splice( index, 1 );

            if ( $parent.hasClass('active') ) {
            
                $('body').addClass('cart-only');

                $parent.removeClass('active');

            } else

            if ( $activeOrden.length && index < $activeOrden.index() ) {

                $('.carlist > div').eq( $activeOrden.index() - 1 ).addClass('active').siblings().removeClass('active');

            } 

            if ( !this.carrito.length ) this.closePopup();

        },

        closePopup: function() {

            $('body').removeClass('showPopup');

        },

        openCart: function() {

            if ( !this.carrito.length ) return

            $('.agregado').hide();

            $('.carlist > div.active').removeClass('active');

            $('body').addClass('showPopup no-trans');

            setTimeout(function(){

                $('body').addClass('cart-only');

            },20);

            setTimeout(function(){

                $('body').removeClass('no-trans');

            },400);

        },

        backClick: function(e) {

            if ( $(e.target).hasClass('popup') ) this.closePopup();

        }
         
    } // methods
});