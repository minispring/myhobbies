package models;

import play.data.format.Formats;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="photo")
public class TPhoto extends Model {

    @Id
    @GeneratedValue
    public Long id;

    @ManyToOne
    public TPost post;

    @ManyToOne
    public TUser author;

    @Formats.DateTime(pattern="yyyy-MM-dd HH:mm:ss")
    public Date create_at;

    public String small;

    public String medium;

    public String large;

    public String name;

    public String photo_path;

    public String photo_name;



}
