type ClearNever<T extends {}> = Pick<
	T,
	{ [Key in keyof T]: T[Key] extends never ? never : Key }[keyof T]
>;

type AnyMap = { [key: string]: any };

type Listener<TypesMap extends AnyMap> = <T extends keyof TypesMap>(
	type: T,
	handler: (data: TypesMap[T]) => any
) => void;

type WildcardListener<TypesMap extends AnyMap> = (
	type: "*",
	handler: (type: keyof TypesMap, data: TypesMap[keyof TypesMap]) => any
) => void;

type HandlersMap<TypesMap extends AnyMap> = {
	[K in keyof TypesMap]: Listener<TypesMap>[]
} & {
	"*": WildcardListener<TypesMap>[];
};

type GetDefined<TypesMap extends AnyMap> = keyof ClearNever<
	{ [T in keyof TypesMap]: TypesMap[T] extends undefined ? never : TypesMap[T] }
>;

type GetUndefined<TypesMap extends AnyMap> = keyof ClearNever<
	{ [T in keyof TypesMap]: TypesMap[T] extends undefined ? TypesMap[T] : never }
>;

type Emit<TypesMap extends AnyMap> = (<D extends GetDefined<TypesMap>>(
	type: D,
	data: TypesMap[D]
) => void) &
	((type: GetUndefined<TypesMap>) => void);

type Mitt<TypesMap extends AnyMap> = {
	on: Listener<TypesMap> & WildcardListener<TypesMap>;
	off: Listener<TypesMap> & WildcardListener<TypesMap>;
	emit: Emit<TypesMap>;
};

export default function mitt<TypesMap extends AnyMap>(
	eventsMap?: HandlersMap<TypesMap>
): Mitt<TypesMap>;
