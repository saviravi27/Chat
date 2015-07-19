//our chat spec goes from here

  describe("Testing getName for div and h1", function() {
      it("checkS div element innerHTML", function () {
        var div = document.createElement("div");
        div.innerHTML = "myDivTag";
        expect(getName(div)).toEqual('myDivTag');
      });

      it("checks h1 element innerHTML", function () {
        var h1 = document.createElement("h1");
        h1.innerHTML = "myh1tag";
        expect(getName(h1)).toEqual('myh1tag');
      });

      it("checks p element innerHTML for is empty string", function () {
        var p = document.createElement("p");
        p.innerHTML = "myptag";
        expect(getName(p)).not.toBeFalsy();
      });

      it("checks empty element", function () {
        var e;
        expect(function(){getName(e)}).toThrow(new Error('Element is empty'));
      });
    });

    describe("Testing getPrivateMessageFormat", function() {
      it("checks private messaging for savitha", function(){
        expect(getPrivateMessageFormat("Hi how are you", "savitha").data).toEqual('/w savitha Hi how are you');
      });

      it("checks private messaging for ravi", function(){
        expect(getPrivateMessageFormat("Hi how are you today?", "ravi").data).toEqual('/w ravi Hi how are you today?');
      });

      it("checks private messaging for empty name string", function(){
        expect(getPrivateMessageFormat("Hi how are you today?", "").data).toBeUndefined();
      });

      it("checks private messaging for empty msg string", function(){
        expect(getPrivateMessageFormat("", "xyz").data).toBeUndefined();
      });

      it("checks private messaging for empty msg and empty name string", function(){
        expect(getPrivateMessageFormat("", "").data).toBeUndefined();
      });

    });

    describe("Testing isUndefinedOrNullOrEmpty", function() {
      it("checks undefined", function(){
        var a;
        expect(isUndefinedOrNullOrEmpty(a)).toEqual(true);
      });

      it("checks null", function(){
        var a = null;
        expect(isUndefinedOrNullOrEmpty(a)).toEqual(true);
      });

      it("checks defined", function(){
        var a = 10;
        expect(isUndefinedOrNullOrEmpty(a)).toEqual(false);
      });

      it("checks not null", function(){
        var a = {};
        expect(isUndefinedOrNullOrEmpty(a)).toEqual(false);
      });

      it("checks empty strings", function(){
        var a = "";
        expect(isUndefinedOrNullOrEmpty(a)).toEqual(true);
      });

      it("checks non-empty strings", function(){
        var a = "abc";
        expect(isUndefinedOrNullOrEmpty(a)).toEqual(false);
      });
    });

   //  it("calls the getName() function", function() {
   //      var fakePvtMsg = new myPrivateMessaging();
   //      fakePvtMsg.getName = jasmine.createSpy("get - name");
   //      fakePvtMsg.myPrivateMessaging(myEl);
   //      expect(fakePvtMsg.getName).toHaveBeenCalled();
	  // });

    // it("getName returns value", function () {
    //   var fakePvtMsg = new myPrivateMessaging();
    //   var data = fakePvtMsg.getName(myEl);
    //   expect(data.innerHTML).toEqual("Employee1");
    // });
  //});