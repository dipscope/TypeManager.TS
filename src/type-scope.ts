import { isNil } from 'lodash';
import { InjectIndex } from './inject-index';
import { InjectOptions } from './inject-options';
import { PropertyName } from './property-name';
import { PropertyOptions } from './property-options';
import { TypeMetadata } from './type-metadata';

/**
 * Special class to create a scope over a certain type. This class used only in 
 * combination with decorators and not required for declarative configuration.
 * 
 * @type {TypeScope}
 */
export class TypeScope
{
    /**
     * Scope open?
     * 
     * @type {boolean};
     */
    private opened: boolean;

    /**
     * Property options array map.
     * 
     * @type {Map<PropertyName, Array<PropertyOptions<any>>>}
     */
    private propertyOptionsArrayMap: Map<PropertyName, Array<PropertyOptions<any>>>;

    /**
     * Inject options array map.
     * 
     * @type {Map<InjectIndex, Array<InjectOptions<any>>>}
     */
    private injectOptionsArrayMap: Map<InjectIndex, Array<InjectOptions<any>>>;

    /**
     * Constructor.
     */
    public constructor()
    {
        this.opened = false;
        this.propertyOptionsArrayMap = new Map<PropertyName, Array<PropertyOptions<any>>>();
        this.injectOptionsArrayMap = new Map<InjectIndex, Array<InjectOptions<any>>>();

        return;
    }

    /**
     * Opens a scope.
     * 
     * @returns {this} Type scope.
     */
    public open(): this
    {
        this.opened = true;
        this.propertyOptionsArrayMap.clear();
        this.injectOptionsArrayMap.clear();

        return this;
    }

    /**
     * Adds property options to the type scope.
     * 
     * @param {PropertyName} propertyName Property name.
     * @param {PropertyOptions<any>} propertyOptions Property options.
     *  
     * @returns {this} Type scope.
     */
    public addPropertyOptions(propertyName: PropertyName, propertyOptions: PropertyOptions<any>): this
    {
        if (!this.opened)
        {
            return this;
        }

        let propertyOptionsArray = this.propertyOptionsArrayMap.get(propertyName);

        if (isNil(propertyOptionsArray)) 
        {
            propertyOptionsArray = new Array<PropertyOptions<any>>();

            this.propertyOptionsArrayMap.set(propertyName, propertyOptionsArray);
        }

        propertyOptionsArray.push(propertyOptions);

        return this;
    }

    /**
     * Adds inject options to the type scope.
     * 
     * @param {InjectIndex} injectIndex Inject index.
     * @param {InjectOptions<any>} injectOptions Inject options.
     *  
     * @returns {this} Type scope.
     */
    public addInjectOptions(injectIndex: InjectIndex, injectOptions: InjectOptions<any>): this
    {
        if (!this.opened)
        {
            return this;
        }

        let injectOptionsArray = this.injectOptionsArrayMap.get(injectIndex);

        if (isNil(injectOptionsArray)) 
        {
            injectOptionsArray = new Array<InjectOptions<any>>();

            this.injectOptionsArrayMap.set(injectIndex, injectOptionsArray);
        }

        injectOptionsArray.push(injectOptions);

        return this;
    }

    /**
     * Closes scope and applies state for type metadata.
     * 
     * @param {TypeMetadata<any>} typeMetadata Type metadata.
     * 
     * @returns {this} Type scope.
     */
    public close(typeMetadata: TypeMetadata<any>): this
    {
        if (!this.opened)
        {
            return this;
        }

        for (const [propertyName, propertyOptionsArray] of this.propertyOptionsArrayMap)
        {
            for (const propertyOptions of propertyOptionsArray)
            {
                typeMetadata.configurePropertyMetadata(propertyName, propertyOptions);
            }
        }

        for (const [injectIndex, injectOptionsArray] of this.injectOptionsArrayMap)
        {
            for (const injectOptions of injectOptionsArray)
            {
                typeMetadata.configureInjectMetadata(injectIndex, injectOptions);
            }
        }

        this.injectOptionsArrayMap.clear();
        this.propertyOptionsArrayMap.clear();
        this.opened = false;

        return this;
    }
}
