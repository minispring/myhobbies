package models;

import play.data.format.Formats;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="circle_members")
public class TCircleMember extends Model {

    @Id
    @GeneratedValue
    public Long id;

    @ManyToOne
    public TCircle circle;

    @ManyToOne
    public TContact contact;

    public User person;

    @Formats.DateTime(pattern="yyyy-MM-dd HH:mm:ss")
    public Date create_at;

    @Formats.DateTime(pattern="yyyy-MM-dd HH:mm:ss")
    public Date update_at;

}
