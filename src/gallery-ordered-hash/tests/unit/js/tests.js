YUI.add('gallery-ordered-hash-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-ordered-hash');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test is empty': function() {
            Y.Assert.isTrue(true);
            var oh = new Y.OrderedHash();

            oh.push({'price':-1});
            oh.push({'a-303': {"units": 3, "width": 10, "height": 10 }});
            oh.push({'a-403': {"units": 3, "width": 10, "height": 10 }});
            oh.push({'a-503': {"units": 3, "width": 10, "height": 10 }});
            oh.push({'a-603': {"units": 3, "width": 10, "height": 10 }});

            console.log(oh.getItem(0));
            console.log(oh.getItem(1));
            console.log(oh.getItem(2));
            console.log(oh.getItem(3));
            console.log(oh.indexOf('a-503'))
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'gallery-ordered-hash' ] });
