import OrderedMap "mo:base/OrderedMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
    type UserProfile = {
        name : Text;
        email : Text;
        organization : ?Text;
        role : Text;
    };

    type FormSchema = {
        id : Text;
        name : Text;
        description : Text;
        fields : [FormField];
        validations : [ValidationRule];
        calculations : [CalculationRule];
        visibilityRules : [VisibilityRule];
        createdBy : Principal;
        createdAt : Int;
    };

    type FormField = {
        id : Text;
        fieldLabel : Text;
        fieldType : FieldType;
        helpText : ?Text;
        defaultValue : ?FieldValue;
        options : ?[FieldOption];
        arrayCount : ?Nat;
        required : Bool;
        pattern : ?Text;
        min : ?Float;
        max : ?Float;
        enumValues : ?[Text];
        units : ?Text;
        rounding : ?Nat;
    };

    type FieldType = {
        #text;
        #number;
        #email;
        #checkbox;
        #radio;
        #toggle;
        #select;
        #array;
    };

    type FieldValue = {
        #text : Text;
        #number : Float;
        #boolean : Bool;
        #array : [FieldValue];
    };

    type FieldOption = {
        value : Text;
        optionLabel : Text;
    };

    type ValidationRule = {
        fieldId : Text;
        ruleType : ValidationRuleType;
        message : Text;
    };

    type ValidationRuleType = {
        #required;
        #pattern : Text;
        #min : Float;
        #max : Float;
        #enum : [Text];
        #unique;
        #crossField : CrossFieldValidation;
    };

    type CrossFieldValidation = {
        fieldIds : [Text];
        validationType : Text;
    };

    type CalculationRule = {
        fieldId : Text;
        formula : Text;
        dependencies : [Text];
        resultType : FieldType;
        units : ?Text;
        rounding : ?Nat;
    };

    type VisibilityRule = {
        fieldId : Text;
        condition : Text;
        dependencies : [Text];
    };

    type FormSubmission = {
        id : Text;
        schemaId : Text;
        values : [FieldValueEntry];
        manifestHash : Blob;
        merkleRoot : Blob;
        nonces : [FieldNonce];
        timestamp : Int;
        user : Principal;
        signature : Blob;
        adminCounterSign : ?Blob;
        merkleProofs : [MerkleProof];
    };

    type FieldValueEntry = {
        fieldId : Text;
        value : FieldValue;
        nonce : Blob;
    };

    type FieldNonce = {
        fieldId : Text;
        nonce : Blob;
    };

    type MerkleProof = {
        fieldId : Text;
        proofPath : [Blob];
        root : Blob;
    };

    type AuditLogEntry = {
        id : Nat;
        timestamp : Int;
        eventType : Text;
        targetId : Text;
        user : Principal;
    };

    type ThemePreference = {
        #light;
        #dark;
        #vibgyor;
    };

    type TabState = {
        id : Text;
        tabLabel : Text;
        contentId : Text;
        isActive : Bool;
        createdAt : Int;
        updatedAt : Int;
    };

    type TestDataFixture = {
        id : Text;
        app : Text;
        template : Text;
        title : Text;
        url : Text;
        createdAt : Int;
        contentHash : Blob;
        nonce : Blob;
        merkleLeaf : Blob;
        verificationStatus : Text;
    };

    type OldActor = {
        blobData : [(Text, Blob)];
        userProfiles : OrderedMap.Map<Principal, UserProfile>;
        formSchemas : OrderedMap.Map<Text, FormSchema>;
        formSubmissions : OrderedMap.Map<Text, FormSubmission>;
        auditLogs : OrderedMap.Map<Nat, AuditLogEntry>;
        themePreferences : OrderedMap.Map<Principal, ThemePreference>;
        tabStates : OrderedMap.Map<Text, TabState>;
        testDataFixtures : OrderedMap.Map<Text, TestDataFixture>;
        nextAuditLogId : Nat;
    };

    public func run(old : OldActor) : OldActor {
        old;
    };
};

